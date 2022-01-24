import { NEXT_URL } from "../config";

export async function upload(base64EncodedImage, cookie) {
  try {
    const response = await fetch(`${NEXT_URL}/api/photos/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookie.token}`,
      },
      body: JSON.stringify({ data: base64EncodedImage }),
    });
    const data = await response.json();
    const imageUrl = data.url;
    return imageUrl;
  } catch (error) {
    console.error(error);
    return error;
  }
}
