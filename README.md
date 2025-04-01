# Apple Watch Health Data Analyzer

A Next.js application that allows users to upload and analyze their Apple Watch health data from export.xml files.

## Features

- Drag-and-drop file upload for Apple Watch export.xml files
- Detailed health and fitness insights visualization
- Interactive charts showing trends over time
- Key metrics summary including steps, heart rate, workouts, and sleep data
- Responsive design with Tailwind CSS
- Server-side rendering for optimal performance

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Format

The application expects an Apple Watch export.xml file. To export your health data:

1. Open the Health app on your iPhone
2. Tap your profile picture
3. Select "Export All Health Data"
4. Choose "Export" and save the file

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- xml2js for XML parsing   
- React Dropzone for file upload

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            # Reusable React components
├── lib/                   # Utility functions and data processing
└── types/                # TypeScript type definitions
```


