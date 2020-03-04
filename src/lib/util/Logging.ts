import Logger, {
  Color,
  DefaultFormatter,
  DefaultFormatterColor,
  LogLevel
} from "@ayanaware/logger";

Logger.getDefaultTransport().setLevel(LogLevel.TRACE);
Logger.setFormatter(
  new DefaultFormatter({
    colorMap: new Map([
      [DefaultFormatterColor.LOG_TIMESTAMP, Color.GRAY],
      [DefaultFormatterColor.LOG_PACKAGE_PATH, Color.BLUE],
      [DefaultFormatterColor.LOG_PACKAGE_NAME, Color.MAGENTA],
      [DefaultFormatterColor.LOG_UNIQUE_MARKER, Color.GRAY]
    ]),
    dateFormat: "hh:mm MM/DD/YYYY"
  })
);
