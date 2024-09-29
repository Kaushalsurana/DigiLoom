import base64
import openai  # Make sure you have the OpenAI API client installed
from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint="https://socialsense-openai-r4-azure.openai.azure.com/",
    api_key="e5f50efc755842419a52867d41cd282d",
    api_version="2024-02-15-preview"
)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def rate_portfolio_images(image_urls):
    # Build the message content for each image
    message_content = []
    
    for i, image_url in enumerate(image_urls):
        message_content.append(
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Image {i+1}: Please evaluate the visual impact of this image on a scale of 1 to 10 and provide a justification for your rating along with suggestions for improvement."},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        )
    
    # Send the request to the API
    response = client.chat.completions.create(
        model="gpt-4o-standard",  # Use the appropriate model
        messages=[
            {
                "role": "system",
                "content": """You are an experienced creative director tasked with evaluating portfolio images. Your goal is to assess the *visual impact* of the provided images on a scale from 1 to 10, where 1 is very weak and 10 is exceptionally impactful. Your analysis for each image should cover:

1. *Visual Impact Rating*: Rate the image on a scale of 1 to 10 based on its overall aesthetic appeal, clarity, originality, and how effectively it communicates the intended message (such as branding for a logo or functionality for a product design).
2. *Justification*: Provide a detailed justification for the score, explaining specific elements that influenced the rating (e.g., use of design principles, innovative concepts, emotional appeal, or clear branding).
3. *Improvement Suggestions*: Suggest areas for improvement, such as enhancing the clarity, refining the design for better visual balance, or making it more visually engaging.

*Visual Impact Scale*:
1-3: Low impact, lacks appeal or clarity, possibly confusing or unoriginal.
4-6: Moderate impact, communicates some ideas but could be more engaging or polished.
7-8: High impact, visually engaging with good clarity and originality, but room for refinement.
9-10: Exceptional impact, highly effective in conveying its purpose with strong aesthetic and creative elements.

Consider factors such as:
- *Aesthetic Appeal*: How pleasing is the image to look at?
- *Clarity of Message*: Does the image effectively convey its intended message (e.g., brand, product)?
- *Originality and Creativity*: Is there a unique or innovative element to the design?
- *Design Functionality*: For items like logos, product designs, or thumbnails, how well does the design serve its purpose?

Evaluate all four images based on these criteria."""
            }
        ] + message_content,
        max_tokens=3000
    )

    # Access the content of the first message choice
    return response.choices[0].message.content

# List of image URLs
image_urls = [
    "https://microsaastest.s3.amazonaws.com/S+4.jpeg",
    "https://microsaastest.s3.amazonaws.com/S1.jpeg",
    "https://microsaastest.s3.amazonaws.com/S2.png",
    "https://microsaastest.s3.amazonaws.com/S3.png"
]

# Calling the function and printing the result
if __name__ == "__main__":
    result = rate_portfolio_images(image_urls)
    print(result)
