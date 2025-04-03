# 🧭 How to Use This Project

This project includes three main tools designed to help researchers explore the oral microbiome in individuals who use substances:

---

## 🔹 1. [OralMicrobiomeSubstanceUse R Package](https://github.com/Maryam-hkiabi/OralMicrobiomeSubstanceUse)

This R package allows you to:
- Download oral microbiome data from HOMD or use your own
- Clean and preprocess sequence data
- Run BLAST searches and parse MEGAN outputs
- Compare microbial species across substance types
- Visualize taxonomic abundance (e.g., bar plots by genus, phylum, strain)

📦 **Install the package:**
```r
# Install from GitHub
devtools::install_github("Maryam-hkiabi/OralMicrobiomeSubstanceUse")

# Load the package
library(OralMicrobiomeSubstanceUse)
```

🚀 **Run the included R Shiny App:**
```r
runApp(system.file("shiny-scripts", "app.R", package = "OralMicrobiomeSubstanceUse"))
```

---

## 🔹 2. [R Shiny Web App](https://maryam-hkiabi.shinyapps.io/shiny-scripts/)

Use this hosted version of the R Shiny app to:
- Explore microbial species by substance type
- View filtered tables and taxonomic graphs
- Use without needing to install R

🌐 **Just click here to launch it:**  
[https://maryam-hkiabi.shinyapps.io/shiny-scripts/](https://maryam-hkiabi.shinyapps.io/shiny-scripts/)

---

## 🔹 3. [Interactive Dashboard (GitHub Pages)](https://maryam-hkiabi.github.io/Oral-Microbiome-Substance-Use-dashboard/)

This frontend dashboard allows you to:
- Filter published studies with associated data by:
  - Species studied
  - Substance category (e.g., Smoking, Cannabis, METH)
  - Substance subtype (e.g., Cigarette, E-Cigarette, Hookah)
  - Bacterial abundance (genus, phylum, strain)
- Explore visualizations showing article counts by substance and bacteria

📁 You can explore the full data CSV here:  
`data/associated_data_clean.csv`
