# About our project

With this project, we analyzed news and media coverage about the COVID-19 pandemic using text-based analysis. More specifically, we explored the most commonly used keywords and compared how different news outlets with different political biases wrote about the pandemic. The pandemic is personal to all of us and the vast difference in media coverage can be detrimental to the health and safety of people. We want to study how different sources convey themes related to the pandemic and how they have an influence on how people perceive it.

Link to the GitHub pages website: [https://neu-ds-4200-f20.github.io/project-group-13-covid19-news/](https://neu-ds-4200-f20.github.io/project-group-13-covid19-news/)

## Setup

**Under no circumstances should you be editing files via the GitHub website user interface.** Do all your edits locally after cloning the repository. Commit major versions to your git repository.

1. Clone this repository to your local machine.
    E.g., in your terminal / command prompt `CD` to where you want this the folder for this activity to be. Then run `git clone <YOUR_REPO_URL>`

2. `CD` or open a terminal / command prompt window into the cloned folder.

3. Start a simple python webserver. E.g., `python -m http.server`, `python3 -m http.server`, or `py -m http.server`. If you are using python 2 you will need to use `python -m SimpleHTTPServer` instead, but please switch to python 3 as [Python 2 was sunset on 2020-01-01](https://www.python.org/doc/sunset-python-2/).

4. Wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`.

5. Now open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000

## Visualization Instructions

1. Open the [Github pages link](https://neu-ds-4200-f20.github.io/project-group-13-covid19-news/) in Google Chrome or Mozilla Firefox. (Safari or other browsers do not support a lot of features of our visualisation.)
2. Brush over the bubbles to select words. The selected words will appear on the line chart and will be highlighted on the table. Hover over each line to display which word it corresponds to and further details. Click on a single row on the table or click and drag across rows to show the word(s) on the line chart and highlight them on the bubble chart.

## Organization

Overview of folders and files in this repository. 

### Root Files

* `README.md` is this explanatory file for the repo.

* `index.html` contains the main website content. 

* `style.css` contains the CSS.

* `LICENCE` is the source code license.

### Folders

Each folder has an explanatory `README.md` file.

* `data` is where all used data is located.

* `favicons` contains the favicons for the web page. 

* `.github` contains [GitHub Actions](https://github.com/features/actions) ([docs](https://docs.github.com/en/actions)) to automatically validate our HTML, CSS, and hyperlinks.

* `files`  contains presentation slides (PDF) and demo video (MP4).

* `img` contains screenshots, diagrams, and photos.

* `js` contains all JavaScript files.

  * `visualization.js` is the main code that builds our visualizations. 
  * `bubble.js` is a reusable model for bubble chart.
  * `table.js` is a reusable model for table.
  * `linachart.js` is a reusable model for line chart.

* `lib` contains the JavaScript library we used. 
