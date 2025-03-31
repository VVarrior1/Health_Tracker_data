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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
