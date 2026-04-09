/* ============================================
   app/api/upload/route.js
   POST handler for resume file uploads
   Netlify doesn't support persistent file storage,
   so we just validate and return file info for direct analysis
   ============================================ */
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!buffer.length) {
      return NextResponse.json({ error: 'Uploaded file is empty. Please choose a valid file.' }, { status: 400 });
    }

    // Generate unique ID for this upload
    const fileId = uuidv4();
    const fileName = file.name;
    
    // Convert buffer to base64 string to pass through JSON
    const fileData = buffer.toString('base64');

    return NextResponse.json({ 
        success: true, 
        fileId, 
        fileName,
        fileData, // Base64 encoded file data
        size: buffer.length
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    return NextResponse.json({ error: 'Failed to upload file. Please try again.' }, { status: 500 });
  }
}
