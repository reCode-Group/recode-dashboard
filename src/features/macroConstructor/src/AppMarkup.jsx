import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { LoaderOverlay } from './components/LoaderOverlay.jsx';
import { Modals } from './components/Modals.jsx';
import { NotificationsHost } from './components/NotificationsHost.jsx';
import { Sidebar } from './components/Sidebar.jsx';

export function AppMarkup({ handlers, isReady, viewerContext }) {
  return (
    <div>
      <LoaderOverlay visible={!isReady} />
      <div style={{ visibility: isReady ? 'visible' : 'hidden' }}>
        <Header handlers={handlers} viewerContext={viewerContext} />
        <main className="layout">
          <aside className="toolbar glass" style={{ display: 'none' }}>
            <div className="tool vba">
              <div className="tool-icon big">
                <span className="material-symbols-outlined">token</span>
              </div>
              <span className="vba-label">VBA</span>
            </div>
            <div className="toolbar-separator" />
            <div className="tool">
              <div className="tool-icon">
                <span className="material-symbols-outlined">alt_route</span>
              </div>
              <span>Логика</span>
            </div>
            <div className="tool">
              <div className="tool-icon">
                <span className="material-symbols-outlined">repeat</span>
              </div>
              <span>Циклы</span>
            </div>
            <div className="tool">
              <div className="tool-icon">
                <span className="material-symbols-outlined">calculate</span>
              </div>
              <span>Мат.</span>
            </div>
            <div className="tool">
              <div className="tool-icon">
                <span className="material-symbols-outlined">format_quote</span>
              </div>
              <span>Текст</span>
            </div>
            <div className="tool">
              <div className="tool-icon">
                <span className="material-symbols-outlined">list_alt</span>
              </div>
              <span>Списки</span>
            </div>
            <div className="tool">
              <div className="tool-icon">
                <span className="material-symbols-outlined">data_object</span>
              </div>
              <span>Перем.</span>
            </div>
            <div className="tool">
              <div className="tool-icon">
                <span className="material-symbols-outlined">functions</span>
              </div>
              <span>Функции</span>
            </div>
          </aside>
          <section className="workspace">
            <div className="empty-state">
              <div className="empty-icon">
                <span className="material-symbols-outlined">extension</span>
              </div>
              <h2>Ваш холст пуст</h2>
              <p>Перетащите блоки из панели слева, чтобы начать создание логики</p>
              <button className="primary-btn" id="addFirstBlockBtn">
                <span className="material-symbols-outlined">add</span>
                Добавить первый блок
              </button>
            </div>
            <div id="blocklyDiv" />
            <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox-categories" style={{ display: 'none' }}>
              <category name="VBA" categorystyle="vba_category"> </category>
              <category name="Перем." categorystyle="variable_category" custom="VARIABLE" />
              <category name="Функции" categorystyle="procedure_category" custom="PROCEDURE" />
              <sep />
              <category name="Логика" categorystyle="logic_category">
                <block type="controls_if" />
                <block type="logic_compare" />
                <block type="logic_operation" />
                <block type="logic_negate" />
                <block type="logic_boolean" />
                <block type="logic_null" disabled="true" />
                <block type="logic_ternary" />
              </category>
              <category name="Циклы" categorystyle="loop_category">
                <block type="controls_repeat_ext">
                  <value name="TIMES">
                    <shadow type="math_number">
                      <field name="NUM">10</field>
                    </shadow>
                  </value>
                </block>
                <block type="controls_repeat" disabled="true" />
                <block type="controls_whileUntil" />
                <block type="controls_for">
                  <value name="FROM">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="TO">
                    <shadow type="math_number">
                      <field name="NUM">10</field>
                    </shadow>
                  </value>
                  <value name="BY">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                </block>
                <block type="controls_forEach" />
                <block type="controls_flow_statements" />
              </category>
              <category name="Мат." categorystyle="math_category">
                <block type="math_number" gap={32}>
                  <field name="NUM">123</field>
                </block>
                <block type="math_arithmetic">
                  <value name="A">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="B">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_single">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">9</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_trig">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">45</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_constant" />
                <block type="math_number_property">
                  <value name="NUMBER_TO_CHECK">
                    <shadow type="math_number">
                      <field name="NUM">0</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_round">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">3.1</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_on_list" />
                <block type="math_modulo">
                  <value name="DIVIDEND">
                    <shadow type="math_number">
                      <field name="NUM">64</field>
                    </shadow>
                  </value>
                  <value name="DIVISOR">
                    <shadow type="math_number">
                      <field name="NUM">10</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_constrain">
                  <value name="VALUE">
                    <shadow type="math_number">
                      <field name="NUM">50</field>
                    </shadow>
                  </value>
                  <value name="LOW">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="HIGH">
                    <shadow type="math_number">
                      <field name="NUM">100</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_random_int">
                  <value name="FROM">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="TO">
                    <shadow type="math_number">
                      <field name="NUM">100</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_random_float" />
                <block type="math_atan2">
                  <value name="X">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="Y">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                </block>
              </category>
              <category name="Текст" categorystyle="text_category">
                <block type="text" />
                <block type="text_join" />
                <block type="text_append">
                  <value name="TEXT">
                    <shadow type="text" />
                  </value>
                </block>
                <block type="text_length">
                  <value name="VALUE">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_isEmpty">
                  <value name="VALUE">
                    <shadow type="text">
                      <field name="TEXT" />
                    </shadow>
                  </value>
                </block>
                <block type="text_indexOf">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">text</field>
                    </block>
                  </value>
                  <value name="FIND">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_charAt">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">text</field>
                    </block>
                  </value>
                </block>
                <block type="text_getSubstring">
                  <value name="STRING">
                    <block type="variables_get">
                      <field name="VAR">text</field>
                    </block>
                  </value>
                </block>
                <block type="text_changeCase">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_trim">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_count">
                  <value name="SUB">
                    <shadow type="text" />
                  </value>
                  <value name="TEXT">
                    <shadow type="text" />
                  </value>
                </block>
                <block type="text_replace">
                  <value name="FROM">
                    <shadow type="text" />
                  </value>
                  <value name="TO">
                    <shadow type="text" />
                  </value>
                  <value name="TEXT">
                    <shadow type="text" />
                  </value>
                </block>
                <block type="text_reverse">
                  <value name="TEXT">
                    <shadow type="text" />
                  </value>
                </block>
                <label text="Input/Output:" web-class="ioLabel" />
                <block type="text_print">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_prompt_ext">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
              </category>
              <category name="Списки" categorystyle="list_category">
                <block type="lists_create_with">
                  <mutation items={0} />
                </block>
                <block type="lists_create_with" />
                <block type="lists_repeat">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">5</field>
                    </shadow>
                  </value>
                </block>
                <block type="lists_length" />
                <block type="lists_isEmpty" />
                <block type="lists_indexOf">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">list</field>
                    </block>
                  </value>
                </block>
                <block type="lists_getIndex">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">list</field>
                    </block>
                  </value>
                </block>
                <block type="lists_setIndex">
                  <value name="LIST">
                    <block type="variables_get">
                      <field name="VAR">list</field>
                    </block>
                  </value>
                </block>
                <block type="lists_getSublist">
                  <value name="LIST">
                    <block type="variables_get">
                      <field name="VAR">list</field>
                    </block>
                  </value>
                </block>
                <block type="lists_split">
                  <value name="DELIM">
                    <shadow type="text">
                      <field name="TEXT">,</field>
                    </shadow>
                  </value>
                </block>
                <block type="lists_sort" />
                <block type="lists_reverse" />
              </category>
            </xml>
          </section>
          <Sidebar handlers={handlers} />
        </main>
        <Footer />
        <Modals handlers={handlers} />
        <NotificationsHost />
      </div>
    </div>
  );
}
