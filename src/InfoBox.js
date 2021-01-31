import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./InfoBox.css";

function InfoBox({ title, cases, active, total, ...props }) {
  const recoveredTab = title.includes("Recover");
  return (
    <Card
      className={`infoBox ${active && "infoBox__selected"} ${
        !recoveredTab && "infoBox__red"
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography color="textSecondary">{title}</Typography>
        <h2 className={`infoBox__cases ${recoveredTab && "infoBox__green"}`}>
          {cases}
        </h2>
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
