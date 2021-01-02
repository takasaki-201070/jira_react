import React, { useState, useEffect } from "react";
import styles from "./TaskList.module.css";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {
  Button,
  Avatar,
  Badge,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableSortLabel,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncDeleteTask,
  selectTasks,
  editTask,
  selectTask,
} from "./taskSlice";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import { SORT_STATE, READ_TASK } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    tableLayout: "fixed",
    minWidth: 350,
  },
  button: {
    margin: theme.spacing(3),
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const TaskList: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);
  // task一覧の各項目タイトルを取得する（画面表示に使う）
  const columns = tasks[0] && Object.keys(tasks[0]);

  // 一覧のソート情報を保持する
  const [state, setState] = useState<SORT_STATE>({
    rows: tasks,
    order: "desc",
    activeKey: "",
  });

  // ソート処理
  const handleClickSortColumn = (column: keyof READ_TASK) => {
    const isDesc = column === state.activeKey && state.order === "desc";
    const newOrder = isDesc ? "asc" : "desc";
    const sortedRows = Array.from(state.rows).sort((a, b) => {
      if (a[column] > b[column]) {
        return newOrder === "asc" ? 1 : -1;
      } else if (a[column] < b[column]) {
        return newOrder === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });

    setState({
      rows: sortedRows,
      order: newOrder,
      activeKey: column,
    });
  };

  // タスクに変更があった場合は、ソート用のデータも上書きする
  useEffect(() => {
    setState((state) => ({
      ...state,
      rows: tasks,
    }));
  }, [tasks]);

  // 状態を表すアイコンの色を変更する
  const renderSwitch = (statusName: string) => {
    switch (statusName) {
      case "未着手":
        return (
          // 赤色
          <Badge variant="dot" color="error">
            {statusName}
          </Badge>
        );
      case "作業中":
        return (
          // 青色
          <Badge variant="dot" color="primary">
            {statusName}
          </Badge>
        );
      case "完了":
        return (
          // 緑色
          <Badge variant="dot" color="secondary">
            {statusName}
          </Badge>
        );
      default:
        return null;
    }
  };

  // レシポンシブルとオーナーの表示をアバターにする
  const conditionalSrc = (user: number) => {
    const loginProfile = profiles.filter(
      (prof) => prof.user_profile === user
    )[0];
    return loginProfile?.img !== null ? loginProfile?.img : undefined;
  };
  // 項目名
  const taskListHeaderName = (column: string) => {
    switch (column) {
      case "task":
        return "タスク名";
      case "status":
        return "状態";
      case "category":
        return "カテゴリ";
      case "estimate":
        return "作業日数";
      case "responsible":
        return "作業者";
      case "owner":
        return "登録者";
      default:
        return column;
    }
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          dispatch(
            editTask({
              id: 0,
              task: "",
              description: "",
              criteria: "",
              responsible: loginUser.id,
              status: "1",
              category: 1,
              estimate: 0,
            })
          );
          dispatch(selectTask(initialState.selectedTask));
        }}
      >
        タスク追加
      </Button>
      {tasks[0]?.task && (
        <TableContainer>
          <Table stickyHeader size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                {columns.map(
                  (column, colIndex) =>
                    (column === "task" ||
                      column === "status" ||
                      column === "category" ||
                      column === "estimate" ||
                      column === "responsible" ||
                      column === "owner") && (
                      <TableCell align="center" key={colIndex}>
                        <TableSortLabel
                          active={state.activeKey === column}
                          direction={state.order}
                          onClick={() => handleClickSortColumn(column)}
                        >
                          <strong>{taskListHeaderName(column)}</strong>
                        </TableSortLabel>
                      </TableCell>
                    )
                )}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.rows.map((row, rowIndex) => (
                <TableRow hover key={rowIndex}>
                  {Object.keys(row).map(
                    (key, colIndex) =>
                      (key === "task" ||
                        key === "status_name" ||
                        key === "category_item" ||
                        key === "estimate") && (
                        <TableCell
                          align="center"
                          className={styles.tasklist__hover}
                          key={`${rowIndex}+${colIndex}`}
                          onClick={() => {
                            dispatch(selectTask(row));
                            dispatch(editTask(initialState.editedTask));
                          }}
                        >
                          {key === "status_name" ? (
                            renderSwitch(row[key])
                          ) : (
                            <span>{row[key]}</span>
                          )}
                        </TableCell>
                      )
                  )}
                  {/* レシポンシブルのアバター画像 */}
                  <TableCell>
                    <Avatar
                      className={classes.small}
                      alt="resp"
                      src={conditionalSrc(row["responsible"])}
                    />
                  </TableCell>
                  {/* オーナーのアバター画像 */}
                  <TableCell>
                    <Avatar
                      className={classes.small}
                      alt="owner"
                      src={conditionalSrc(row["owner"])}
                    />
                  </TableCell>
                  {/* 削除ボタンと編集ボタン */}
                  <TableCell align="center">
                    <button
                      className={styles.tasklist__icon}
                      onClick={() => {
                        dispatch(fetchAsyncDeleteTask(row.id));
                      }}
                      disabled={row["owner"] !== loginUser.id}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </button>
                    <button
                      className={styles.tasklist__icon}
                      onClick={() => dispatch(editTask(row))}
                      disabled={row["owner"] !== loginUser.id}
                    >
                      <EditOutlinedIcon />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default TaskList;
