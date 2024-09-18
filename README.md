# PixMistri

PixMistri is a simple and powerful photo editing web application built with Flask. Users can upload images, apply filters, crop, resize, draw shapes, and add text to customize their photos. The app is designed to be fast, easy to use, and accessible on the web.

## Features

- Image upload and download
- Crop, resize, and rotate images
- Apply filters such as grayscale, sepia, and invert
- Draw shapes (rectangles, circles, lines)
- Add custom text with font, size, and color options
- Undo and redo actions

## Demo

The live version of the app is deployed on [Render]([https://render.com](https://pixmistri.onrender.com/)).

## Installation

To run PixMistri locally, follow these steps:

### Prerequisites

- Python 3.6+
- Pip (Python package installer)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/PixMistri.git
    ```

2. Navigate into the project directory:
    ```bash
    cd PixMistri
    ```

3. Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

4. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5. Run the Flask app:
    ```bash
    python app.py
    ```

6. Open your browser and go to `http://127.0.0.1:5000` to view the app.

## Deployment

To deploy PixMistri on [Render](https://render.com) or any other hosting platform:

1. Ensure you have a `requirements.txt` file that lists all dependencies.
2. In `app.py`, set the app to run on the appropriate port:
    ```python
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
    ```

3. Push your code to GitHub or your preferred Git provider.

4. Set up a new web service on Render (or your chosen platform) and link your GitHub repository.

5. Use the following settings for Render:
    - Build Command: `pip install -r requirements.txt`
    - Start Command: `gunicorn app:app`

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (with Cropper.js and Canvas API)
- **Deployment**: Render

## Project Structure
.
├── static/
│   ├── images/
│   │   └── icon.png
│   ├── styles.css
│   └── script.js
├── templates/
│   └── index.html
├── app.py
├── requirements.txt
└── README.md

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
Flask for the web framework
Gunicorn for deployment
Render for free hosting
Cropper.js for the crop tool
