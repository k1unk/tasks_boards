import React, {FC, useState} from 'react';
import {observer} from "mobx-react-lite";
import newTask from "../store/newTask";

const PriorityOptions: FC = observer(() => {
    let [optionsVisible, setOptionsVisible] = useState<boolean>(false)

    let priorities = [3, 2, 1]

    return (
        <div className={"priorityOptionsContainer"}>
            <img src={require("../images/arrowDown.png")}
                 alt=""
                 onClick={() => setOptionsVisible(true)}/>
            {optionsVisible && <div className={"optionsPriority"}>
                <div className="outside" onClick={() => setOptionsVisible(false)}></div>
                <div className="content">
                    <div className="text">Priority</div>
                    <div className="flags">
                        {priorities.map((e: number) =>   <img
                            className={newTask.priority === e ? `flag${e} active` : `flag${e}`}
                            src={require(`../images/priority${e}.png`)}
                            alt=""
                            onClick={() => newTask.setPriority(e)}
                            key={e}
                        />)}

                    </div>
                </div>
            </div>
            }
        </div>
    );
})


export default PriorityOptions;
