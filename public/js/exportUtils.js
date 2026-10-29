// Export utilities: PDF print compilation, JSON export/import, and clipboard sharing
const ExportUtils = {
  // Export current story as a clean JSON file
  exportJSON(story) {
    if (!story) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(story, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const safeTitle = (story.title || 'ai_story').toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute("download", `${safeTitle}_story.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Import story from uploaded JSON file
  importJSON(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.title && parsed.scenes) {
          callback(null, parsed);
        } else {
          callback(new Error("Invalid story file structure."));
        }
      } catch (err) {
        callback(err);
      }
    };
    reader.readAsText(file);
  },

  // Copy full story text to clipboard
  copyStoryText(story) {
    if (!story) return;
    let fullText = `${story.title}\n`;
    fullText += `Genre: ${story.genre} | Style: ${story.artStyle}\n`;
    fullText += `Summary: ${story.summary}\n\n`;
    fullText += `=== CHARACTERS ===\n`;
    (story.characters || []).forEach(c => {
      fullText += `• ${c.name} (${c.role}): ${c.description}\n`;
    });
    fullText += `\n=== SCENES ===\n`;
    (story.scenes || []).forEach(sc => {
      fullText += `\n--- ${sc.title} ---\n${sc.narration}\n`;
    });

    navigator.clipboard.writeText(fullText).then(() => {
      alert("Story narrative copied to clipboard!");
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
    });
  },

  // Open formatted print preview for instant browser "Save as PDF"
  printStorybook(story) {
    if (!story) return;

    // Inject temporary print container or trigger window.print
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to generate the printable PDF Storybook.");
      return;
    }

    const scenesHtml = (story.scenes || []).map(sc => `
      <div class="print-page">
        <div class="scene-header">
          <span class="scene-badge">SCENE ${sc.sceneNumber}</span>
          <h2 class="scene-title">${sc.title}</h2>
        </div>
        <div class="scene-image-wrap">
          <img src="${sc.imageUrl}" alt="${sc.title}" onerror="this.style.display='none'" />
        </div>
        <p class="scene-text">${sc.narration}</p>
        <div class="scene-footer">
          <span>Mood: ${sc.mood || 'Inspirational'}</span>
          <span>${story.title}</span>
        </div>
      </div>
    `).join('');

    const charactersHtml = (story.characters || []).map(c => `
      <div class="char-badge">
        <strong>${c.name}</strong> (${c.role})<br/>
        <small>${c.description}</small>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${story.title} - AI Illustrated Storybook</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cover-page {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            page-break-after: always;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 40px;
            background: linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%);
          }
          .cover-badge {
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            background: #4f46e5;
            color: #ffffff;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 700;
            margin-bottom: 20px;
          }
          h1.book-title {
            font-family: 'Playfair Display', serif;
            font-size: 38px;
            color: #0f172a;
            margin: 0 0 16px 0;
            line-height: 1.2;
          }
          .book-meta {
            font-size: 15px;
            color: #64748b;
            margin-bottom: 30px;
          }
          .cover-img {
            max-width: 90%;
            max-height: 380px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
            margin-bottom: 30px;
          }
          .cover-summary {
            font-size: 16px;
            line-height: 1.6;
            color: #334155;
            max-width: 650px;
            font-style: italic;
          }
          .char-section {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
            margin-top: 24px;
          }
          .char-badge {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 8px 16px;
            border-radius: 8px;
            text-align: left;
            font-size: 13px;
          }
          .print-page {
            page-break-before: always;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 0;
          }
          .scene-header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .scene-badge {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: #4f46e5;
          }
          .scene-title {
            font-family: 'Playfair Display', serif;
            font-size: 26px;
            margin: 4px 0 0 0;
            color: #0f172a;
          }
          .scene-image-wrap {
            width: 100%;
            height: 340px;
            border-radius: 10px;
            overflow: hidden;
            background: #f1f5f9;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .scene-image-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .scene-text {
            font-size: 17px;
            line-height: 1.8;
            color: #1e293b;
            margin: 0 0 24px 0;
            font-family: 'Playfair Display', Georgia, serif;
          }
          .scene-footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="cover-page">
          <div class="cover-badge">AI Illustrated Storybook • ${story.genre}</div>
          <h1 class="book-title">${story.title}</h1>
          <div class="book-meta">Visual Art Style: ${story.artStyle} • Audience: ${story.audience}</div>
          <img class="cover-img" src="${story.coverImage || (story.scenes[0] && story.scenes[0].imageUrl)}" alt="Cover" />
          <p class="cover-summary">"${story.summary}"</p>
          <div class="char-section">
            ${charactersHtml}
          </div>
        </div>
        ${scenesHtml}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 800);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
};

window.ExportUtils = ExportUtils;
