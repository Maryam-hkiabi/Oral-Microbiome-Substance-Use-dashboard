$(document).ready(function () {
  const csvURL = "data/associated_data_clean.csv";
  const bacteriaData = [
    {"Bacteria": "Prevotella", "Level": "Genus"},
    {"Bacteria": "Streptococcus", "Level": "Genus"},
    {"Bacteria": "Firmicutes", "Level": "Phylum"},
    {"Bacteria": "Veillonella", "Level": "Genus"},
    {"Bacteria": "Fusobacterium", "Level": "Genus"},
    {"Bacteria": "Bacteroidetes", "Level": "Phylum"},
    {"Bacteria": "Porphyromonas", "Level": "Genus"},
    {"Bacteria": "Actinomyces", "Level": "Genus"},
    {"Bacteria": "Rothia", "Level": "Genus"},
    {"Bacteria": "Synergistetes", "Level": "Phylum"}
  ];

  Papa.parse(csvURL, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data.filter(row => row["article title"]);

      function updateBacteriaDropdown(level) {
        const options = bacteriaData.filter(b => !level || b.Level === level);
        $('#bacteria-filter').empty().append('<option value="">All</option>');
        options.forEach(row => {
          $('#bacteria-filter').append(`<option value="${row.Bacteria}">${row.Bacteria}</option>`);
        });
      }

      const speciesSet = new Set();
      const substanceSet = new Set();
      const subtypeSet = new Set();
      data.forEach(row => {
        if (row["Species studied"]) speciesSet.add(row["Species studied"]);
        if (row["substance category"]) substanceSet.add(row["substance category"]);
        if (row["substance subtype"]) subtypeSet.add(row["substance subtype"]);
      });
      speciesSet.forEach(s => $('#species-filter').append(`<option value="${s}">${s}</option>`));
      substanceSet.forEach(s => $('#substance-filter').append(`<option value="${s}">${s}</option>`));
      subtypeSet.forEach(s => $('#subtype-filter').append(`<option value="${s}">${s}</option>`));

      $('#bacteria-level-filter').on('change', function () {
        const level = $(this).val();
        updateBacteriaDropdown(level);
      });

      function populateTable(filteredData) {
        const tableBody = $('#data-table tbody');
        tableBody.empty();
        filteredData.forEach(row => {
          const link = row["data link"] ? `<a href="${row["data link"]}" target="_blank">View</a>` : "—";
          tableBody.append(`
            <tr>
              <td>${row["article title"]}</td>
              <td>${row["Species studied"]}</td>
              <td>${row["substance studied"]}</td>
              <td>${row["sample collection source"]}</td>
              <td>${row["what sequenced_y"]}</td>
              <td>${row["Higher abundance"]}</td>
              <td>${row["lower abundance"]}</td>
              <td>${row["No difference"]}</td>
              <td>${row["final results"]}</td>
              <td>${link}</td>
            </tr>
          `);
        });
        $('#data-table').DataTable();
      }

      function updateCharts(data) {
        const substanceCounts = {};
        data.forEach(row => {
          const sub = row["substance category"];
          if (sub) substanceCounts[sub] = (substanceCounts[sub] || 0) + 1;
        });
        const substanceData = [{
          x: Object.keys(substanceCounts),
          y: Object.values(substanceCounts),
          type: 'bar',
          marker: { color: '#5e81ac' }
        }];
        Plotly.newPlot('substance-chart', substanceData, {
          title: 'Articles per Substance Type'
        });

        const trackedBacteria = bacteriaData.map(b => b.Bacteria);
        const bacteriaCounts = {};
        trackedBacteria.forEach(name => { bacteriaCounts[name] = 0; });
        data.forEach(row => {
          if (row["Higher abundance"]) {
            trackedBacteria.forEach(name => {
              if (row["Higher abundance"].includes(name)) {
                bacteriaCounts[name]++;
              }
            });
          }
        });
        const bacteriaKeys = Object.keys(bacteriaCounts).filter(k => bacteriaCounts[k] > 0);
        const bacteriaDataPlot = [{
          x: bacteriaKeys,
          y: bacteriaKeys.map(k => bacteriaCounts[k]),
          type: 'bar',
          marker: { color: '#a3be8c' }
        }];
        Plotly.newPlot('bacteria-chart', bacteriaDataPlot, {
          title: 'Mentions of Bacteria in Higher Abundance',
          margin: { t: 50, b: 150 },
          xaxis: { tickangle: -45 }
        });
      }

      populateTable(data);
      updateCharts(data);

      $('#species-filter, #substance-filter, #subtype-filter, #bacteria-filter').on('change', function () {
        const selectedSpecies = $('#species-filter').val();
        const selectedSubstance = $('#substance-filter').val();
        const selectedSubtype = $('#subtype-filter').val();
        const selectedBacteria = $('#bacteria-filter').val();
        const filtered = data.filter(row => {
          const matchSpecies = !selectedSpecies || row["Species studied"] === selectedSpecies;
          const matchSubstance = !selectedSubstance || row["substance category"] === selectedSubstance;
          const matchSubtype = !selectedSubtype || row["substance subtype"] === selectedSubtype;
          const matchBacteria = !selectedBacteria || (row["Higher abundance"] && row["Higher abundance"].includes(selectedBacteria));
          return matchSpecies && matchSubstance && matchSubtype && matchBacteria;
        });
        $('#data-table').DataTable().clear().destroy();
        populateTable(filtered);
        updateCharts(filtered);
      });
    }
  });
});
