/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blockly React Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from "react";
import "./BlocklyComponent.css";

import Blockly from "blockly/core";
import locale from "blockly/msg/en";
import "blockly/blocks";

Blockly.setLocale(locale);

class BlocklyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blocklyDiv = React.createRef();
    this.toolbox = React.createRef();
  }

    componentDidMount() {
        var toolboxx = {
            "kind": "categoryToolbox",
            "contents": [
              {
                "kind": "category",
                "name": "Control",
                "contents": [
                  {
                    "kind": "block",
                    "type": "controls_if"
                  },
                  {
                    "kind": "block",
                    "type": "logic_compare"
                  }
                ]
              },
              {
                "kind": "category",
                "name": "Logic",
                "contents": [
                  {
                    "kind": "block",
                    "type": "logic_compare"
                  },
                  {
                    "kind": "block",
                    "type": "logic_operation"
                  },
                  {
                    "kind": "block",
                    "type": "logic_boolean"
                  },
                  {
                    "kind": "block",
                    "type": "logic_negate"
                  },
                  {
                    "kind": "block",
                    "type": "logic_null"
                  },
                  {
                    "kind": "block",
                    "type": "logic_ternary"
                  }
                ]
              },
              {
                "kind": "category",
                "name": "Loops",
                "contents": [
                  {
                    "kind": "block",
                    "type": "controls_repeat_ext"
                  },
                  {
                    "kind": "block",
                    "type": "controls_whileUntil"
                  },
                  {
                    "kind": "block",
                    "type": "controls_for"
                  },
                  {
                    "kind": "block",
                    "type": "controls_forEach"
                  },
                  {
                    "kind": "block",
                    "type": "controls_flow_statements"
                  }
                ]
              },
              {
                "kind": "category",
                "name": "Math",
                "contents": [
                  {
                    "kind": "block",
                    "type": "math_number"
                  },
                  {
                    "kind": "block",
                    "type": "math_arithmetic"
                  },
                  {
                    "kind": "block",
                    "type": "math_single"
                  },
                  {
                    "kind": "block",
                    "type": "math_trig"
                  },
                  {
                    "kind": "block",
                    "type": "math_constant"
                  },
                  {
                    "kind": "block",
                    "type": "math_number_property"
                  },
                  {
                    "kind": "block",
                    "type": "math_round"
                  },
                  {
                    "kind": "block",
                    "type": "math_on_list"
                  },
                  {
                    "kind": "block",
                    "type": "math_modulo"
                  },
                  {
                    "kind": "block",
                    "type": "math_constrain"
                  },
                  {
                    "kind": "block",
                    "type": "math_random_int"
                  },
                  {
                    "kind": "block",
                    "type": "math_random_float"
                  }
                ]
              },
              {
                "kind": "category",
                "name": "Lists",
                "contents": [
                  {
                    "kind": "block",
                    "type": "lists_create_empty"
                  },
                  {
                    "kind": "block",
                    "type": "lists_create_with"
                  },
                  {
                    "kind": "block",
                    "type": "lists_repeat"
                  },
                  {
                    "kind": "block",
                    "type": "lists_length"
                  },
                  {
                    "kind": "block",
                    "type": "lists_isEmpty"
                  },
                  {
                    "kind": "block",
                    "type": "lists_indexOf"
                  }
                ]
              },
              {
                "kind": "category",
                "name": "Text",
                "contents": [
                    {
                        "kind": "block",
                        "type": "text_print"
                    },
                ]
              },
              {
                "kind": "category",
                "name": "Variables",
                "contents": [
                //   {
                //     "kind": "button",
                //     "text": "Create variable",
                //     "callbackKey": "CREATE_VARIABLE"
                //   },
                  {
                    "kind": "block",
                    "type": "variables_set"
                  },
                  {
                    "kind": "block",
                    "type": "variables_get"
                  },
                ]
              }
            ]
          };

        const { initialXml, children, ...rest } = this.props;
        this.primaryWorkspace = Blockly.inject(
            this.blocklyDiv.current,
            {
                toolbox: toolboxx,
                ...rest
            },
        );

        // changes theme to dark mode
        this.primaryWorkspace.setTheme(Blockly.Themes.Dark);

        this.primaryWorkspace.registerButtonCallback("CREATE_VARIABLE", () => {console.log("create variable");});

        if (initialXml) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initialXml), this.primaryWorkspace);
        }
    }

  get workspace() {
    return this.primaryWorkspace;
  }

  setXml(xml) {
    Blockly.Xml.domToWorkspace(
      Blockly.Xml.textToDom(xml),
      this.primaryWorkspace
    );
  }

  render() {
    const { children } = this.props;

    return (
      <React.Fragment>
        <div ref={this.blocklyDiv} id="blocklyDiv" />
        <xml
          xmlns="https://developers.google.com/blockly/xml"
          is="blockly"
          style={{ display: "none" }}
          ref={this.toolbox}
        >
          {children}
        </xml>
      </React.Fragment>
    );
  }
}

export default BlocklyComponent;
