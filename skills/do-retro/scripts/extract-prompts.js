#!/usr/bin/env node
// ABOUTME: Extracts user prompts from a project's Claude Code transcript JSONL files.
// ABOUTME: Outputs them as markdown grouped by date, for use in do-retro generation.

import fs from "fs";
import path from "path";
import os from "os";

function getProjectTranscriptDir(projectDir) {
  const encoded = projectDir.replace(/[/.]/g, "-");
  return path.join(os.homedir(), ".claude", "projects", encoded);
}

function stripSystemTags(content) {
  return content
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/<command-message>[\s\S]*?<\/command-message>/g, "")
    .replace(/<command-name>[\s\S]*?<\/command-name>/g, "");
}

function extractPrompts(lines) {
  const prompts = [];
  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.type !== "user") continue;
    if (!entry.message || typeof entry.message.content !== "string") continue;
    const cleaned = stripSystemTags(entry.message.content).trim();
    if (!cleaned) continue;
    prompts.push({
      timestamp: entry.timestamp || "",
      content: cleaned,
      sessionId: entry.sessionId || "",
    });
  }
  prompts.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return prompts;
}

function formatPromptsMarkdown(prompts) {
  if (prompts.length === 0) return "";
  const byDate = new Map();
  for (const p of prompts) {
    const date = p.timestamp.slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(p);
  }
  const sections = [];
  for (const [date, datePrompts] of byDate) {
    const lines = [`## ${date}`];
    for (const p of datePrompts) {
      const time = p.timestamp.slice(11, 16);
      const quoted = p.content.split("\n").map((l) => `> ${l}`).join("\n");
      lines.push(`### ${time}\n${quoted}`);
    }
    sections.push(lines.join("\n\n"));
  }
  return sections.join("\n\n");
}

function extractAllPrompts(projectDir) {
  const transcriptDir = getProjectTranscriptDir(projectDir);
  if (!fs.existsSync(transcriptDir)) {
    console.error(`No Claude Code transcripts found for ${projectDir}`);
    process.exit(1);
  }
  const jsonlFiles = fs
    .readdirSync(transcriptDir)
    .filter((f) => f.endsWith(".jsonl"))
    .map((f) => path.join(transcriptDir, f));
  if (jsonlFiles.length === 0) {
    console.error("No session transcripts found.");
    process.exit(1);
  }
  const allLines = [];
  for (const file of jsonlFiles) {
    const content = fs.readFileSync(file, "utf-8");
    allLines.push(...content.split("\n").filter((l) => l.trim()));
  }
  const prompts = extractPrompts(allLines);
  if (prompts.length === 0) {
    console.log("No user prompts found in transcripts.");
    return;
  }
  console.log(formatPromptsMarkdown(prompts));
}

const projectDir = process.argv[2] || process.cwd();
extractAllPrompts(projectDir);
