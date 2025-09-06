import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";
import { Task } from "../../type";
import useReorderMutation from "./useReorderMutation";

const useDragReorder = (todo: Task) => {
  const [tempTodo, setTempTodo] = useState<Task | null>(null);
  const mutation = useReorderMutation();

  const dataIds = useMemo<UniqueIdentifier[]>(() => {
    return todo?.map(({ order }) => order!) || [];
  }, [todo]);

  const reorder = useCallback(
    async function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);

        const reorderdData = arrayMove(todo, oldIndex, newIndex);
        setTempTodo(
          reorderdData.map((item, index) => ({ ...item, order: index + 1 }))
        );
        await mutation.mutateAsync(
          reorderdData.map((item, index) => ({
            id: item.id,
            order: index + 1,
          }))
        );
        setTempTodo(null);
      }
    },
    [mutation, todo, dataIds]
  );
  return { reorder, dragItem: tempTodo ?? todo, disable: mutation.isPending };
};

export default useDragReorder;
