import React from "react";
import { useTable, useSortBy } from "react-table";
import { FaSort, FaSortUp, FaSortDown, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import styles from "./styles/productTableComponent.module.css";

const ProductTableComponent = ({ data = [], onEdit, onDelete, isEmpty }) => {
  const tableData = Array.isArray(data) ? data : [];

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Product Name", accessor: "name" },
      { Header: "Subcategory", accessor: "subCategory" },
      { Header: "Category", accessor: "category" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Action",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className={styles.actionButtons}>
            <button
              onClick={() => onEdit(row.original)}
              className={styles.editButton}
            >
              <FaRegEdit />
            </button>
            <button
              onClick={() => onDelete(row.original.id)}
              className={styles.deleteButton}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: tableData,
        initialState: { sortBy: [{ id: "id", desc: false }] },
      },
      useSortBy
    );

  return (
    <div>
      {isEmpty ? (
        <h3 className={styles.empty}>Please add some products</h3>
      ) : (
        <div className={styles.tableContainer}>
          <table {...getTableProps()} className={styles.table}>
            <thead className={styles.thead}>
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={styles.th}
                    >
                      {column.render("Header")}
                      <span className={styles.sortIcon}>
                        {column.canSort ? (
                          column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown />
                            ) : (
                              <FaSortUp />
                            )
                          ) : (
                            <FaSort />
                          )
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className={styles.tbody}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className={styles.tr}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className={styles.td}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductTableComponent;