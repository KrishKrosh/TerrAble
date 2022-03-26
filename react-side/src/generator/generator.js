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
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import * as Blockly from 'blockly/core';
import 'blockly/javascript';
import { Block } from '../Blockly';

Blockly.JavaScript['test_react_field'] = function (block) {
    return 'console.log(\'custom block\');\n';
};

Blockly.JavaScript['test_react_date_field'] = function (block) {
    return 'console.log(' + block.getField('DATE').getText() + ');\n';
};

Blockly.JavaScript['text_print'] = function(block) {
    // Print statement.
    var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '';
    return 'println!("{}", ' + msg + ');\n';
};

Blockly.JavaScript['controls_if'] = function(block) {
    // If/elseif/else condition.
    var n = 0;
    var code = '', branchCode, conditionCode;
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
      // Automatic prefix insertion is switched off for this block.  Add manually.
      code += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
          block);
    }
    do {
      conditionCode = Blockly.JavaScript.valueToCode(block, 'IF' + n,
          Blockly.JavaScript.ORDER_NONE) || 'false';
      branchCode = Blockly.JavaScript.statementToCode(block, 'DO' + n);
      if (Blockly.JavaScript.STATEMENT_SUFFIX) {
        branchCode = Blockly.JavaScript.prefixLines(
            Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
            block), Blockly.JavaScript.INDENT) + branchCode;
      }
      code += (n > 0 ? ' else ' : '') +
          'if ' + conditionCode + ' {\n' + branchCode + '}';
      ++n;
    } while (block.getInput('IF' + n));
  
    if (block.getInput('ELSE') || Blockly.JavaScript.STATEMENT_SUFFIX) {
      branchCode = Blockly.JavaScript.statementToCode(block, 'ELSE');
      if (Blockly.JavaScript.STATEMENT_SUFFIX) {
        branchCode = Blockly.JavaScript.prefixLines(
            Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
            block), Blockly.JavaScript.INDENT) + branchCode;
      }
      code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
  };

  Blockly.JavaScript['controls_repeat_ext'] = function(block) {
    // Repeat n times.
    if (block.getField('TIMES')) {
      // Internal number.
      var repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
      // External number.
      var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
          Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
    }
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block);
    var code = '';
    var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'count', Blockly.VARIABLE_CATEGORY_NAME);
    var endVar = repeats;
    if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
      endVar = Blockly.JavaScript.variableDB_.getDistinctName(
          'repeat_end', Blockly.VARIABLE_CATEGORY_NAME);
      code += 'let ' + endVar + ' = ' + repeats + ';\n';
    }
    code += 'for ' + loopVar + ' in 1..' + endVar + ' {\n' + branch + '}\n';
    return code;
  };

  Blockly.JavaScript['controls_whileUntil'] = function(block) {
    // Do while/until loop.
    var until = block.getFieldValue('MODE') == 'UNTIL';
    var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
        until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
        Blockly.JavaScript.ORDER_NONE) || 'loop';
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block);
    if (until) {
      argument0 = '!' + argument0;
    }
    var return_statement;
    if (argument0.match('loop')) {
        return_statement = 'loop {' + branch + '}';
    } else {
        return_statement = 'while ' + argument0 + ' {' + branch + '}';
    }
    return return_statement + '\n';
  };

  Blockly.JavaScript['variables_get'] = function(block) {
    // Variable getter.
    var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.VARIABLE_CATEGORY_NAME);
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

Blockly.JavaScript['variables_set'] = function(block) {
    // Variable setter.
    var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return varName + ' = ' + argument0 + ';\n';
  };

  Blockly.JavaScript.init = function(workspace) {
    // Create a dictionary of definitions to be printed before the code.
    Blockly.JavaScript.definitions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions).
    Blockly.JavaScript.functionNames_ = Object.create(null);
  
    if (!Blockly.JavaScript.variableDB_) {
      Blockly.JavaScript.variableDB_ =
          new Blockly.Names(Blockly.JavaScript.RESERVED_WORDS_);
    } else {
      Blockly.JavaScript.variableDB_.reset();
    }
  
    Blockly.JavaScript.variableDB_.setVariableMap(workspace.getVariableMap());
  
    var defvars = [];
    // Add developer variables (not created or named by the user).
    var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
    for (var i = 0; i < devVarList.length; i++) {
      defvars.push(Blockly.JavaScript.variableDB_.getName(devVarList[i],
          Blockly.Names.DEVELOPER_VARIABLE_TYPE));
    }
  
    // Add user variables, but only ones that are being used.
    var variables = Blockly.Variables.allUsedVarModels(workspace);
    for (var i = 0; i < variables.length; i++) {
      defvars.push(Blockly.JavaScript.variableDB_.getName(variables[i].getId(),
          Blockly.VARIABLE_CATEGORY_NAME));
    }
  
    // Declare all of the variables.
    if (defvars.length) {
      Blockly.JavaScript.definitions_['variables'] =
          'let ' + defvars.join(', ') + ';';
    }
  };
  
  Blockly.JavaScript['instantiate'] = function(block) {
    var code = 
    `
    pub fn instantiate (
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        msg: InstantiateMsg,
    ) -> Result <Response, ContractError> {
        let state = State {
            count: msg.count,
            owner: info.sender.clone(),
        };
        set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
        STATE.save(deps.storage, &state)?;
    
        Ok(Response::new()
            .add_attribute("method", "instantiate")
            .add_attribute("owner", info.sender)
            .add_attribute("count", msg.count.to_string())
    }\n
    `;
    return code;
  };

  Blockly.JavaScript['execute'] = function(block) {
    var code = 
    `
    pub fn execute (
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        msg: ExecuteMsg,
    ) -> Result <Response, ContractError> {
        match msg {
            ExecuteMsg::Increment {} => try_increment(deps),
            ExecuteMsg::Reset { count } => try_reset(deps, count),
        }
    }\n
    `;
    return code;
  };

  Blockly.JavaScript['querydef'] = function(block) {
    var code = 
    `
    pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
        match msg {
            QueryMsg::GetCount {} => to_binary(&query_count(deps)?),
        }
    }
    
    fn query_count(deps: Deps) -> StdResult<CountResponse> {
        let state = STATE.load(deps.storage)?;
        Ok(CountResponse { count: state.count })
    }\n
    `;
    return code;
  }

  Blockly.JavaScript['query'] = function(block) {
    var code = 
    `
    let success = query(Deps, Env, QueryMsg);\n
    `;
    return code;
}