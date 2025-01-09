import React, { useState } from "react";
import { styled } from "../stitches.config";
import { countries } from "../constants";

const CalendarWrapper = styled("div", {
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  overflow: "hidden",
  padding: "$lg",
  fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
});

const Header = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: "$md",
  marginBottom: "$lg",
  boxSizing: "border-box",
  backgroundColor: "#FFFFFFCC",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "$sm",
  backdropFilter: "blur(5px)",
});

const Title = styled("h2", {
  margin: 0,
  fontSize: "24px",
  textAlign: "center",
  flex: 1,
  color: "#1F2937",
});

const Button = styled("button", {
  backgroundColor: "#4A90E2",
  color: "#FFFFFF",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  padding: "10px 20px",
  borderRadius: "8px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
  },
});

const SearchInput = styled("input", {
  width: "100%",
  padding: "$md",
  marginX: "$md",
  marginBottom: "$lg",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "16px",
  boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
  "&:focus": {
    borderColor: "#4A90E2",
    outline: "none",
  },
});

const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "$lg",
  width: "100%",
  flexGrow: 1,
  overflowY: "auto",
  padding: "20px",
  boxSizing: "border-box",
  background: "#FFFFFFCC",
  borderRadius: "12px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
});

const Day = styled("div", {
  position: "relative",
  padding: "$lg",
  textAlign: "center",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  cursor: "pointer",
  transition: "background-color 0.3s, transform 0.2s",
  "&:hover": {
    backgroundColor: "#FFFBCC",
    transform: "scale(1.03)",
  },
  variants: {
    disabled: {
      true: {
        backgroundColor: "#F9FAFB",
        color: "#6B7280",
        pointerEvents: "none",
        cursor: "not-allowed",
        boxShadow: "none",
      },
    },
  },
});

const Task = styled("div", {
  marginTop: "$sm",
  padding: "$sm",
  backgroundColor: "#F06292",
  color: "#FFFFFF",
  borderRadius: "4px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  fontSize: "14px",
  textAlign: "left",
  cursor: "grab",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#E55B81",
  },
});

const TaskInput = styled("input", {
  width: "100%",
  margin: "$xs 0",
  padding: "$xs",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "14px",
});

interface Task {
  id: number;
  text: string;
}

interface Holiday {
  date: string;
  name: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({});
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  React.useEffect(() => {
    fetchHolidaysForAllCountries();
  }, [year]);

  const fetchHolidaysForAllCountries = async () => {
    try {
      setIsLoading(true);
      const holidayPromises = countries.map((country) =>
        fetchHolidays(country.countryCode)
      );
      const allHolidays = (await Promise.all(holidayPromises)).flat();
      setHolidays(allHolidays);
    } catch (error) {
      console.error("Error fetching holidays for all countries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHolidays = async (countryCode: string) => {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching holidays for ${countryCode}:`, error);
      return [];
    }
  };

  const handleTaskAdd = (dayKey: string, text: string) => {
    setTasks((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), { id: Date.now(), text }],
    }));
  };

  const handleTaskEdit = (taskId: number, text: string) => {
    setEditingTaskId(taskId);
    setEditingText(text);
  };

  const saveEditedTask = (dayKey: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[dayKey] = updatedTasks[dayKey].map((task) =>
        task.id === editingTaskId ? { ...task, text: editingText } : task
      );
      return updatedTasks;
    });
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleDragStart = (
    event: React.DragEvent,
    dayKey: string,
    taskId: number
  ) => {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ dayKey, taskId })
    );
  };

  const handleDrop = (event: React.DragEvent, targetDayKey: string) => {
    const { dayKey, taskId } = JSON.parse(event.dataTransfer.getData("text"));

    if (dayKey !== targetDayKey) {
      const task = tasks[dayKey].find((t) => t.id === taskId);

      setTasks((prev: any) => ({
        ...prev,
        [dayKey]: prev[dayKey].filter((t: Task) => t.id !== taskId),
        [targetDayKey]: [...(prev[targetDayKey] || []), task],
      }));
    }
  };

  const handleTaskReorder = (
    event: React.DragEvent,
    dayKey: string,
    taskId: number
  ) => {
    const { dayKey: draggedDayKey, taskId: draggedTaskId } = JSON.parse(
      event.dataTransfer.getData("text")
    );

    if (dayKey === draggedDayKey) {
      const reorderedTasks = [...tasks[dayKey]];
      const taskIndex = reorderedTasks.findIndex((task) => task.id === taskId);
      const draggedTaskIndex = reorderedTasks.findIndex(
        (task) => task.id === draggedTaskId
      );

      reorderedTasks.splice(taskIndex, 0, reorderedTasks.splice(draggedTaskIndex, 1)[0]);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [dayKey]: reorderedTasks,
      }));
    }
  };

  const generateDays = () => {
    const days = [];
    const today = new Date();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dayKey = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      days.push(
        <Day key={dayKey} disabled>
          <strong style={{ color: "#aaa" }}>{day}</strong>
        </Day>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const currentDate = new Date(year, month, day);
      const isPast = currentDate < new Date(today.setHours(0, 0, 0, 0));

      const holiday = holidays.find((holiday) => holiday.date === dayKey);
      const isHoliday = holiday !== undefined;

      days.push(
        <Day
          key={dayKey}
          disabled={isPast || isHoliday}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            if (isHoliday || isPast) {
              e.preventDefault();
            } else {
              handleDrop(e, dayKey);
            }
          }}
        >
          <strong>{day}</strong>

          {isHoliday && (
            <div style={{ fontSize: "12px", color: "red" }}>{holiday.name}</div>
          )}

          {!isPast &&
            !isHoliday &&
            (tasks[dayKey] || [])
              .filter((task) =>
                task.text.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((task) => (
                <Task
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, dayKey, task.id)}
                  onClick={() => handleTaskEdit(task.id, task.text)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleTaskReorder(e, dayKey, task.id)}
                >
                  {editingTaskId === task.id ? (
                    <TaskInput
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => saveEditedTask(dayKey)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveEditedTask(dayKey);
                        }
                      }}
                    />
                  ) : (
                    task.text
                  )}
                </Task>
              ))}

          {!isPast && !isHoliday && (
            <TaskInput
              placeholder="Add Task"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  (e.target as HTMLInputElement).value.trim()
                ) {
                  handleTaskAdd(
                    dayKey,
                    (e.target as HTMLInputElement).value.trim()
                  );
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          )}
        </Day>
      );
    }

    const totalCells = days.length;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
      for (let i = 1; i <= remainingCells; i++) {
        const dayKey = `${year}-${String(month + 2).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        days.push(
          <Day key={dayKey} disabled>
            <strong style={{ color: "#aaa" }}>{i}</strong>
          </Day>
        );
      }
    }

    return days;
  };

  return (
    <CalendarWrapper>
      <Header>
        <Button onClick={handlePrevMonth}>◀</Button>
        <Title>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </Title>
        <Button onClick={handleNextMonth}>▶</Button>
      </Header>
      <SearchInput
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <span>Loading Holidays...</span>
        </div>
      ) : (
        <Grid>{generateDays()}</Grid>
      )}
    </CalendarWrapper>
  );
};

export default Calendar;
