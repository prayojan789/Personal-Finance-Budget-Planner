/**
 * CSV Export/Import Service
 * Handles exporting and importing financial data
 */

export const exportToCSV = (data, filename = "budget-planner-data.csv") => {
  const { transactions, budgets, goals } = data;
  let csv = "type,description,amount,category,date,note\n";

  // Add transactions
  transactions.forEach((t) => {
    const note = (t.note || "").replace(/"/g, '""'); // Escape quotes
    csv += `${t.type},"${t.description || ""}",${t.amount},"${t.category || ""}","${t.date}","${note}"\n`;
  });

  // Add a separator for budgets
  csv += "\n# BUDGETS\n";
  csv += "category,limit,month,alertAt\n";
  budgets.forEach((b) => {
    csv += `"${b.category}",${b.limit},"${b.month || ""}",${b.alertAt || 80}\n`;
  });

  // Add a separator for goals
  csv += "\n# GOALS\n";
  csv += "name,targetAmount,targetDate,savedAmount,createdAt\n";
  (goals || []).forEach((goal) => {
    const name = (goal.name || "").replace(/"/g, '""');
    csv += `"${name}",${goal.targetAmount},"${goal.targetDate}",${goal.savedAmount || 0},"${goal.createdAt || ""}"\n`;
  });

  //- Create blob and download
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split("\n");
        const transactions = [];
        const budgets = [];
        const goals = [];
        let isReadingBudgets = false;
        let isReadingGoals = false;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          if (line.startsWith("#")) {
            if (line.includes("BUDGETS")) {
              isReadingBudgets = true;
              isReadingGoals = false;
              i++; // Skip header
              continue;
            }
            if (line.includes("GOALS")) {
              isReadingBudgets = false;
              isReadingGoals = true;
              i++; // Skip header
              continue;
            }
          }

          if (isReadingGoals) {
            const parsed = parseCSVLine(line);
            if (parsed.length >= 3 && parsed[0] && !parsed[0].startsWith("#")) {
              goals.push({
                name: parsed[0].replace(/"/g, ""),
                targetAmount: Number(parsed[1]),
                targetDate: parsed[2].replace(/"/g, ""),
                savedAmount: Number(parsed[3] || 0),
                createdAt: parsed[4] ? parsed[4].replace(/"/g, "") : "",
              });
            }
          } else if (isReadingBudgets) {
            const parsed = parseCSVLine(line);
            if (parsed.length >= 3 && parsed[0] && !parsed[0].startsWith("#")) {
              budgets.push({
                category: parsed[0].replace(/"/g, ""),
                limit: Number(parsed[1]),
                month: parsed[2].replace(/"/g, ""),
                alertAt: Number(parsed[3]) || 80,
              });
            }
          } else {
            const parsed = parseCSVLine(line);
            if (parsed.length >= 5 && parsed[0]) {
              transactions.push({
                type: parsed[0],
                description: parsed[1].replace(/"/g, ""),
                  amount: Number(parsed[2]),
                category: parsed[3].replace(/"/g, ""),
                date: parsed[4].replace(/"/g, ""),
                note: parsed[5] ? parsed[5].replace(/"/g, "") : "",
              });
            }
          }
        }

        resolve({ transactions, budgets, goals });
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};
