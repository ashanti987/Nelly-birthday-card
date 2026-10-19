# Jay's Birthday Experience

A responsive, interactive birthday-card website built with plain HTML, CSS, and JavaScript.

## Run it in VS Code

1. Unzip this folder.
2. Open the `jay_birthday_experience` folder in VS Code.
3. Open `index.html` in a browser. Recommended: install the **Live Server** extension in VS Code, right-click `index.html`, then choose **Open with Live Server**.
4. Test the flow from the cake through the envelope, card, notes, and finale.

The microphone feature generally needs `localhost` (Live Server) or a secure HTTPS website. If microphone access is blocked, the candle button still works.

## Add your photos

Put up to five pictures in the `photos` folder and name them:

- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg`
- `photo5.jpg`

Use JPG images for the simplest setup. You can change the filenames and captions in the `photos` array near the top of `script.js`. If a photo is missing, a designed placeholder appears instead.

For best results, use pictures you both like, crop them roughly portrait-shaped, and resize very large images before adding them.

## Personalize the words

Open `index.html` to change the main card letter. Open `script.js` and find `const notes` to personalize the four pop-up notes. Replace the generic memory note with a real moment you shared. Update photo captions in the `photos` array.

## Customize the look

Colors are defined at the top of `style.css` in `:root`. The default palette is burgundy, cream, rose, and gold. Layout adapts to mobile screens.

## Publish it as a link

After testing, publish the folder with a static hosting service such as GitHub Pages or Netlify. Upload the project files while keeping the `photos` folder and filenames intact. Use the HTTPS link they provide to share it with Jay.

## Notes

- This project does not collect or send personal information.
- The microphone is optional and only used in the browser to detect a puff of air; it is not recorded or uploaded.
- The Google Fonts are loaded from Google Fonts when internet access is available. System fallbacks are included.
- The example wording is a starter. Make the letter and notes sound like you before sharing the link.
