import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedTask } from "./taskSlice";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";

const TaskDisplay: React.FC = () => {
  const selectedTask = useSelector(selectSelectedTask);
  const rows = [
    { item: "Task", data: selectedTask.task },
    { item: "Description", data: selectedTask.description },
    { item: "Criteria", data: selectedTask.criteria },
    { item: "Owner", data: selectedTask.owner_username },
    { item: "Responsible", data: selectedTask.responsible_username },
    { item: "Estimate [days]", data: selectedTask.estimate },
    { item: "Category", data: selectedTask.category_item },
    { item: "Status", data: selectedTask.status_name },
    { item: "Created", data: selectedTask.created_at },
    { item: "Updated", data: selectedTask.updated_at },
  ];
  // 項目名
  const taskListHeaderName = (column: string) => {
    switch (column) {
      case "Task":
        return "タスク名";
      case "Description":
        return "作業内容";
      case "Criteria":
        return "完了基準";
      case "Status":
        return "状態";
      case "Category":
        return "カテゴリ";
      case "Estimate [days]":
        return "作業日数";
      case "Responsible":
        return "作業者";
      case "Owner":
        return "登録者";
      case "Created":
        return "登録日時";
      case "Updated":
        return "更新日時";
      default:
        return column;
    }
  };
  // selectedTaskが存在しない場合は、何も返さず終了する
  if (!selectedTask.task) {
    return null;
  }

  return (
    <>
      <h2>詳細</h2>
      <Table size="small">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.item}>
              <TableCell align="left">
                <strong>{taskListHeaderName(row.item)}</strong>
              </TableCell>
              <TableCell align="left">{row.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TaskDisplay;
