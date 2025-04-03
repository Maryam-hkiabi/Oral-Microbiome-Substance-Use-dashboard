$(document).ready(function () {
  $.get('data/associated_data_clean.csv', function (csv) {
    const rows = Papa.parse(csv, { header: true }).data;

    rows.forEach(row => {
      const link = row["data link"] ? `<a href="${row["data link"]}" target="_blank">View</a>` : "—";
      $('#data-table tbody').append(`
        <tr>
          <td>${row["article title"]}</td>
          <td>${row["substance studied"]}</td>
          <td>${row["sample type"]}</td>
          <td>${row["what sequenced"]}</td>
          <td>${link}</td>
        </tr>
      `);
    });

    $('#data-table').DataTable();
  });
});
