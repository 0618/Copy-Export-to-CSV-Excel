import React from "react";
import "./styles.css";
import data from "./data.json";
import zipcelx from "zipcelx";

const getTableText = (data, divider) => {
	const columns = Object.keys(data[0]);
	const th = `${columns.join(divider)}`;
	const td = data
		.map((item) => Object.values(item).join(`"${divider}"`))
		.join('"\n');
	return `${th}\n"${td}"`;
};

const exportToCSV = (text, fileName) => {
	const hiddenElement = document.createElement("a");
	const date = new Date();
	hiddenElement.href =
		"data:text/plain;charset=utf-8," + encodeURIComponent(text);
	hiddenElement.download = `${fileName}-${date.toISOString()}.csv`;
	hiddenElement.click();
};

export default function App() {
	const handleCopy = (evt) => {
		if (!navigator.clipboard) {
			return;
		}
		const text = getTableText(data, "\t");
		// The following line doesn't work in CodeSandbox
		navigator.clipboard.writeText(text).then(() => {
			console.log("Copied to clipboard");
		});
	};

	const handleExportToCSV = (evt) => {
		const text = getTableText(data, ",");
		exportToCSV(text, "filename");
	};

	const handelExportToExcel = (evt) => {
		const headData = Object.keys(data[0]).map((col) => ({
			value: col,
			type: "string",
		}));
		const bodyData = data.map((item) =>
			Object.values(item).map((value) => ({ value, type: typeof value }))
		);
		const config = {
			filename: "filename",
			sheet: { data: [headData, ...bodyData] },
		};
		zipcelx(config);
	};

	return (
		<div className="App">
			<h1>Table</h1>
			<table>
				<thead>
					<tr>
						{Object.keys(data[0]).map((col) => (
							<th key={col}>{col}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map(({ id, name, age }) => (
						<tr key={id}>
							<td>{id}</td>
							<td>{name}</td>
							<td>{age}</td>
						</tr>
					))}
				</tbody>
			</table>
			<button onClick={handleCopy}>Copy</button>
			<button onClick={handleExportToCSV}>Export to CSV</button>
			<button onClick={handelExportToExcel}>Export to Excel</button>
		</div>
	);
}
