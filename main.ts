enum FlowType {
  assign,
  operator,
  if,
  loop,
  query,
  transfrom,
  log,
}

enum DataType {
  int,
  string,
  boolean,
  jsonObjectArray,
  jsonArray,
}

type KeyValue = { [key: string]: any };

type AssignType = {
  name: string;
  dataType: DataType;
  default: any;
};

type IfType = {};
type LoopType = {
  key: string;
  flow: Flow[];
};
type LogType = {
  key: string;
  message: string;
};
type Flow = {
  type: FlowType;
  assign?: AssignType;
  if?: IfType;
  loop?: LoopType;
  log?: LogType;
};

const forEachProcess = (
  data: KeyValue,
  flow: Flow[],
  variable: KeyValue
): KeyValue => {
  Object.entries(data).map((v) => {
    console.log(v);
  });

  return variable;
};

const runFlow = (flow: Flow[], variables: KeyValue): KeyValue => {
  flow.map((f) => {
    switch (f.type) {
      case FlowType.assign: {
        variables[f.assign?.name ?? ""] = f.assign?.default;
        break;
      }
      case FlowType.loop: {
        variables = forEachProcess(
          variables[f.loop?.key ?? ""],
          f.loop?.flow ?? [],
          variables
        );
        break;
      }
      case FlowType.log: {
        console.log(f.log?.message, variables[f.log?.key ?? ""]);
        break;
      }
    }
  });

  return variables;
};

const main = () => {
  const flows: Flow[] = [
    {
      type: FlowType.assign,
      assign: {
        name: "arr1",
        dataType: DataType.jsonObjectArray,
        default: [
          {
            code: "1",
            name: "n-1",
          },
          {
            code: "2",
            name: "n-2",
          },
        ],
      },
    },
    {
      type: FlowType.loop,
      loop: {
        key: "arr1",
        flow: [],
      },
    },
  ];
  let variables: KeyValue = {};
  variables = runFlow(flows, variables);
};

main();
