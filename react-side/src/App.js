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
 * @fileoverview Main React component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
//import loading from react bootstrap
import Spinner from "react-bootstrap/Spinner";

import logo from "./logo.svg";

import BlocklyComponent, { Block, Value, Field, Shadow } from "./Blockly";

import BlocklyJS from "blockly/javascript";

import "./blocks/customblocks";
import "./generator/generator";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.simpleWorkspace = React.createRef();
    this.state = { code: "", renderedCode: "", loading: false, success: false };
  }

  componentDidMount() {
    this.simpleWorkspace.current.workspace.addChangeListener(this.generateCode);
  }

  generateCode = (event) => {
    var code = BlocklyJS.workspaceToCode(
      this.simpleWorkspace.current.workspace
    );
    this.setState({ renderedCode: code });
    console.log(code);
  };

  deploy = async () => {
    this.setState({ loading: true });
    // fetch from an api
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Wallet" }),
    };
    fetch("https://reqres.in/api/posts", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ loading: false, success: true });
        console.log(data);
      });
  };

  //whenever the ref changes, console.log the code
  onRefChange = (node) => {
    console.log("onRefChange");
    console.log(node);
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <div className="flex-child" style={{ height: "100vh", width: "70vw" }}>
          <BlocklyComponent
            ref={this.simpleWorkspace}
            readOnly={false}
            trashcan={true}
            media={"media/"}
            move={{
              scrollbars: true,
              drag: true,
              wheel: true,
            }}
            initialXml={`
          <xml xmlns="http://www.w3.org/1999/xhtml">
          </xml>
                `}
          >
            <Block type="test_react_field" />
            <Block type="test_react_date_field" />
            <Block type="controls_ifelse" />
            <Block type="logic_compare" />
            <Block type="logic_operation" />
            <Block type="controls_repeat_ext">
              <Value name="TIMES">
                <Shadow type="math_number">
                  <Field name="NUM">10</Field>
                </Shadow>
              </Value>
            </Block>
            <Block type="logic_operation" />
            <Block type="logic_negate" />
            <Block type="logic_boolean" />
            <Block type="logic_null" disabled="true" />
            <Block type="logic_ternary" />
            <Block type="text_charAt">
              <Value name="VALUE">
                <Block type="variables_get">
                  <Field name="VAR">text</Field>
                </Block>
              </Value>
            </Block>
          </BlocklyComponent>
        </div>
        <div
          className="flex-child scroll"
          style={{ maxWidth: "30vw", color: "white", backgroundColor: "black" }}
        >
          {!this.state.success ? (
            !this.state.loading ? (
              this.state.renderedCode.split("\n").map((line, i) => {
                return (
                  <p style={{ color: "white" }} key={i}>
                    {line}
                    <br />
                  </p>
                );
              }, this)
            ) : (
              <Spinner animation="border" variant="success" />
            )
          ) : (
            <h1>Deployed to Terra!</h1>
          )}
          {!this.state.success ? (
            <div class="bottom-right">
              <input placeholder="Wallet Name:"></input>
              <br />
              <input placeholder="Wallet Address:"></input>
              <br />
              <input type="password" placeholder="Wallet Password:"></input>
              <br />
              <br />
              <Button
                style={{ marginLeft: "60%", marginRight: "auto" }}
                variant="primary"
                onClick={this.deploy}
              >
                Deploy!
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
