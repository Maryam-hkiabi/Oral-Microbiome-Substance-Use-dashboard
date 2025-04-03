$(document).ready(function () {
  const csvURL = "https://raw.githubusercontent.com/Maryam-hkiabi/Oral-Microbiome-Substance-Use-dashboard/main/data/associated_data_clean.csv";

  Papa.parse(csvURL, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;

      // Clear filters
      $('#species-filter').empty().append('<option value="">All</option>');
      $('#substance-filter').empty().append('<option value="">All</option>');

      // Build sets
      const speciesSet = new Set();
      const substanceSet = new Set();

      data.forEach(row => {
        if (row["Species studied"]) speciesSet.add(row["Species studied"]);
        if (row["substance studied"]) substanceSet.add(row["substance studied"]);
      });

      speciesSet.forEach(species => {
        $('#species-filter').append(`<option value="${species}">${species}</option>`);
      });

      substanceSet.forEach(sub => {
        $('#substance-filter').append(`<option value="${sub}">${sub}</option>`);
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

      // Initial full table
      populateTable(data);

      // Filter logic
      $('#species-filter, #substance-filter').on('change', function () {
        const selectedSpecies = $('#species-filter').val();
        const selectedSubstance = $('#substance-filter').val();

        const filtered = data.filter(row => {
          const matchSpecies = !selectedSpecies || row["Species studied"] === selectedSpecies;
          const matchSubstance = !selectedSubstance || row["substance studied"] === selectedSubstance;
          return matchSpecies && matchSubstance;
        });

        $('#data-table').DataTable().clear().destroy();
        populateTable(filtered);
      });
    }
  });
});
