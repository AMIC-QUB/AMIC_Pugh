# AMIC Pugh Matrix — Design for Sustainability

Use AMIC Pugh Matrix to compare an incumbent product with alternative concepts before committing to detailed design. The default `test.csv` uses an electric-kettle example and contains illustrative values only; replace them with project evidence before making a decision.

## What the criteria mean

- **Material:** virgin material mass and recycled content indicate resource demand.
- **Production:** manufacturing energy estimates energy required to make one product.
- **Use:** annual use energy and service life show the impact and value delivered in service.
- **End of life:** disassembly time and recyclable mass indicate how readily the product can be recovered.
- **Feasibility:** unit cost is optional; use it to expose commercial trade-offs alongside sustainability.

These lifecycle groups are adapted from Han, Jiang and Childs’ concept-stage sustainability metrics: [Metrics for Measuring Sustainable Product Design Concepts](https://doi.org/10.3390/en14123469).

## How to use the CSV

1. Download `test.csv` and replace each row with the incumbent and candidate concepts. Keep the first column for the design name, the second for an optional image URL or image filename, and one numeric column per criterion.
2. Upload the CSV to AMIC Pugh Matrix. Set **Lower is better** for `Virgin_Material_g`, `Manufacturing_Energy_MJ`, `Use_Energy_kWh_per_year`, `Disassembly_Time_min`, and `Unit_Cost_GBP`.
3. Keep **Higher is better** for `Recycled_Content_pct`, `Service_Life_years`, and `Recyclable_Mass_pct`. Apply project-agreed weights and filters, then export the ranked result.

Use consistent units across concepts and record the source, assumptions, and system boundary for every value.
