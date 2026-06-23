<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3a199fc6-704f-4311-b70e-c0b3d48c71ab

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
### ✨ Key Features

- 🕵️‍♂️ **AI-Powered Occupancy Scanner**: Analyzes live camera feeds or photo uploads to accurately count attendees, identify teachers/students, and isolate bounding coordinates.
- 📐 **Spatial & Demographic Analytics**: Dynamically compiles and visualizes live classroom density metrics (Left vs. Right seating distribution, Front vs. Back row splits, and Faculty ratios).
- 🎯 **Interactive Capacity Guard**: Live slider inputs allow moderators to set expected attendance thresholds, triggering instant status assessments (Expected Met, Under Capacity, or Overcrowded).
- 📋 **Dynamic Report Compiler**: Compiles clean, markdown-friendly textual attendance logs comprising coordinates, timestamps, and cognitive AI remarks to the clipboard with one click.
- 🗄️ **Chronological Scan Feed**: Backed by persistent browser storage to log, search, reload, or discard historical snapshot cards seamlessly without a database dependency.
