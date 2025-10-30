# 📄 Report Template (LaTeX)

This folder contains a simple **LaTeX template**.

---

## 🧱 Files Included

- **`report.tex`** — main LaTeX source file
- **`bibfile.bib`** — example bibliography file (for references)

---

## 🚀 How to Use

1. **Install LaTeX**
    - macOS: install [MacTeX](https://www.tug.org/mactex/)
    - Windows: install [MiKTeX](https://miktex.org/)
    - Linux: install TeX Live (`sudo apt install texlive-full`)

2. **Open the Project**  
   You can open and edit the `.tex` file using:
    - [TeXShop](https://pages.uoregon.edu/koch/texshop/) (macOS)
    - [TeXworks](https://www.tug.org/texworks/)
    - [Overleaf](https://www.overleaf.com/) (online, no installation needed)
    - VS Code with the “LaTeX Workshop” extension

3. **Compile the Report**  
   Run this command in the terminal (from the project folder):
   ```bash
   pdflatex report.tex
   bibtex report
   pdflatex report.tex
   pdflatex report.tex 
   ```
   This will generate report.pdf

4. **Edit report.tex and/or bibfile.bib**  
   Repeat step 3.

---

## 💡 Tips
1. **Recompile twice**  
Always run pdflatex twice after editing citations or references.

2. **Add a new page**  
Use the command \newpage in your .tex file.

3. **File output**  
The compiled PDF will appear as report.pdf in the same directory.