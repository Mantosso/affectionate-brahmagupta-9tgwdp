import React, { useEffect, useRef } from "react";
import { LabelStudio } from "@heartexlabs/label-studio";
import "@heartexlabs/label-studio/build/static/css/main.css";

const LabelStudioWrapper = ({ task, onExit }) => {
  const lsfRef = useRef(null);

  useEffect(() => {
    if (!lsfRef.current || !task) return;

    const lsf = new LabelStudio(lsfRef.current, {
      config: `
<View>
  <Image name="img" value="$image" zoom="true" zoomControl="true"></Image>
  <RectangleLabels name="tag" toName="img">
    <Label value="Дефект" background="#FF0000"></Label>
    <Label value="Трещина" background="#00FF00"></Label>
  </RectangleLabels>
</View>`,
      interfaces: [
        "panel",
        "controls",
        "side-column",
        "annotations:menu",
        "annotations:add-new",
        "annotations:delete",
      ],
      task: {
        id: task.id,
        data: task.data,
        annotations: task.annotations || [],
        predictions: task.predictions || [],
      },
    });

    return () => {
      if (lsf) {
        lsf.destroy();
      }
    };
  }, [task]);

  return (
    <div className="label-studio-wrapper">
      <button className="back-button" onClick={onExit}>
        ← Назад к списку архивов
      </button>
      <div
        ref={lsfRef}
        className="label-studio-container"
        style={{ height: "calc(100vh - 50px)", width: "100%" }}
      />
    </div>
  );
};

export default LabelStudioWrapper;
