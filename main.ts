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
  key: string;
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
  refKey: string,
  data: KeyValue,
  flow: Flow[],
  variables: KeyValue
): KeyValue => {
  data.map((d, i) => {
    Object.entries(d).map((v) => {
      const [key, val] = v;
      variables[`${refKey}${i}${key}`] = val;
      runFlow(flow, variables, `${refKey}${i}`);
    });
  });

  return variables;
};

const runFlow = (
  flow: Flow[],
  variables: KeyValue,
  refKey: string = ""
): KeyValue => {
  flow.map((f) => {
    switch (f.type) {
      case FlowType.assign: {
        variables[`${refKey}${f.assign?.key ?? ""}`] = f.assign?.default;
        break;
      }
      case FlowType.loop: {
        variables = forEachProcess(
          f.loop?.key ?? "",
          variables[f.loop?.key ?? ""],
          f.loop?.flow ?? [],
          variables
        );
        break;
      }
      case FlowType.log: {
        console.log(f.log?.message, variables[`${refKey}${f.log?.key ?? ""}`]);
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
        key: "arr1",
        dataType: DataType.jsonObjectArray,
        default: [
          {
            code: 1,
            name: "n-1",
          },
          {
            code: 2,
            name: "n-2",
          },
        ],
      },
    },
    {
      type: FlowType.loop,
      loop: {
        key: "arr1",
        flow: [
		{
			type: FlowType.log,
			log: {
				key: "code",
				message: "code"
			},
		},
		{
			type: FlowType.log,
			log: {
				key: "name",
				message: "name"
			},
		}
	],
      },
    },
  ];
  let variables: KeyValue = {};
  variables = runFlow(flows, variables);
  console.log(variables)
};

main();
