#!/usr/bin/env python3
"""
Timestamp parsing utility for audio-guided sync.
Converts transcript timestamps to seconds.
"""

import re
from typing import List, Tuple


def parse_timestamp(timestamp_str: str) -> float:
    """
    Convert timestamp string to seconds.
    
    Format: [HH:MM:SS.mmm] -> Text
    Returns: float (seconds with milliseconds)
    
    Example:
        "[00:02:15.450]" → 135.45
    """
    # Extract time portion
    match = re.search(r'\[(\d{2}):(\d{2}):(\d{2}\.\d{3})\]', timestamp_str)
    if not match:
        raise ValueError(f"Invalid timestamp format: {timestamp_str}")
    
    hours, minutes, seconds = match.groups()
    total_seconds = int(hours) * 3600 + int(minutes) * 60 + float(seconds)
    
    return round(total_seconds, 3)


def parse_transcript_file(filepath: str) -> List[Tuple[float, str]]:
    """
    Parse entire transcript file.
    
    Returns: List of (seconds, text) tuples
    """
    entries = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or not line.startswith('['):
                continue
            
            # Split timestamp and text
            parts = line.split(' -> ', 1)
            if len(parts) != 2:
                continue
            
            timestamp_str, text = parts
            seconds = parse_timestamp(timestamp_str)
            entries.append((seconds, text.strip()))
    
    return entries


def identify_chapters(entries: List[Tuple[float, str]], min_gap: float = 20.0) -> List[int]:
    """
    Identify chapter boundaries based on time gaps.
    
    Args:
        entries: List of (seconds, text) tuples
        min_gap: Minimum time gap (seconds) to mark as chapter
    
    Returns: List of indices that should be chapters
    """
    chapter_indices = [0]  # First entry is always a chapter
    
    for i in range(1, len(entries)):
        time_gap = entries[i][0] - entries[i-1][0]
        
        # Check for time gap
        if time_gap > min_gap:
            chapter_indices.append(i)
            continue
        
        # Check for transition keywords
        text = entries[i][1].lower()
        transition_words = [
            'lass uns', 'jetzt', 'schauen wir', 'beginnen wir',
            'kommen wir zu', 'als nächstes', 'zum schluss'
        ]
        
        if any(word in text for word in transition_words):
            chapter_indices.append(i)
    
    return chapter_indices


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python parse_timestamps.py <transcript.md>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    # Parse transcript
    entries = parse_transcript_file(filepath)
    
    print(f"Parsed {len(entries)} transcript entries\n")
    
    # Show first few entries
    print("First 5 entries:")
    for i, (seconds, text) in enumerate(entries[:5]):
        print(f"  [{seconds:7.2f}s] {text[:60]}...")
    
    # Identify chapters
    chapters = identify_chapters(entries)
    print(f"\nIdentified {len(chapters)} chapter markers:")
    for idx in chapters:
        seconds, text = entries[idx]
        print(f"  [{seconds:7.2f}s] {text[:60]}...")
