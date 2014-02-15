
/*******************************************************************************
 * This is just for testing the state machine (only used during testing). 
 * It show you a simple example.
 * To test with node.js :
 *      clear && node -e "require('./StateMachine');require('./TestingStateMachine');testSateMachine();"
 *******************************************************************************/
testSateMachine = function() {
    s = new YaStateMachineJS({});
    var stateInit = s.newState({
        do: function() {
            console.log("state action : do in the SM (state initial).");
        },
        ending: function() {
            console.log("state action : ending in the SM (state initial).");
        },
        entering: function() {
            console.log("state action : entering in the SM (state initial).");
        }
    });
    s.setInitSate(stateInit);
    var state1 = s.newState({
        entering: function() {
            console.log("state action : I'm \"state1\" and I entering().");
        },
        do: function() {
            console.log("state action : I'm \"state1\" and I do(). My name is \""+this.data.name+"\" ");
        },
        ending: function() {
            console.log("state action : I'm \"state1\" and I ending().");
        }, 
        data:{name:"etat num 1"}
    });
    stateInit.newTransition(state1, function() {
        return true;
    });
    
    var state2 = s.newState({
        entering: function() {
            console.log("_->2");
        },
        do: function() {
            console.log(" 2()");
        },
        ending: function() {
            console.log("2->_");
        }
    });
    stateInit.newTransition(state2, function() {
        return true;
    });
    
    //---
    s.start();
    s.do();
    s.transition();
    s.do();
    s.do();//second times
    s.stop();
}

