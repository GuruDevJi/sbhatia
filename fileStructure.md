# Project File Structure

```text
sb1/
├── .eleventy.js                        Eleventy configuration file
├── .github/                            GitHub Actions workflows and configuration
├── .gitignore                          Git ignore patterns
├── CNAME                               Custom domain or GitHub Pages configuration
├── fileStructure.md                    Description of the project file structure
├── package.json                        NPM package configuration and scripts
├── package-lock.json                   NPM dependency lock file
├── scripts/                            Utility scripts
│   └── geocode_journey.js              Script to geocode journey locations
└── src/                                Source code directory
    ├── _data/                          Global data files for Eleventy site
    │   ├── awards.json                 Data for awards and recognition
    │   ├── education.json              Data for educational background
    │   ├── experience.json             Data for work experience
    │   ├── journey.json                Data for professional journey timeline
    │   ├── licenses.json               Data for licenses and certifications
    │   ├── projects.json               Data for portfolio projects
    │   ├── var.json                    Global site variables and configuration
    │   └── volunteering.json           Data for volunteering activities
    ├── _includes/                      Reusable templates and partials
    │   └── base.njk                    Base layout template used across pages
    ├── assets/                         Static assets
    │   ├── css/                        Stylesheets
    │   │   ├── backups/                Directory containing backup CSS files
    │   │   ├── contact.css             Styles specific to the contact page
    │   │   ├── home.css                Styles specific to the home page
    │   │   ├── main.css                Main global stylesheet
    │   │   ├── profile.css             Styles specific to the profile page
    │   │   ├── projects.css            Styles specific to the projects page
    │   │   ├── speaker-gallery.css     Styles specific to the speaker gallery
    │   │   └── specializations.css     Styles specific to the specializations page
    │   ├── images/                     Directory for image assets (logos, photos, etc.)
    │   ├── js/                         JavaScript files
    │   │   └── main.js                 Main client-side script
    │   └── ref/                        Reference directory
    ├── contact.njk                     Contact page template
    ├── index.njk                       Home page (landing page) template
    ├── profile.njk                     Profile/About Me page template
    ├── projects.njk                    Projects portfolio page template
    ├── speaker-gallery.njk             Speaker gallery page template
    ├── specializations.njk             Specializations/Skills page template
    └── specializations.njk.backup      Backup file for specializations page
```
