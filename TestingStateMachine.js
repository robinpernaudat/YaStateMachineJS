
/*******************************************************************************
 * This is just for testing the state machine (only used during testing). 
 * It show you a simple example.
 * To test with node.js :
 *      clear && node -e "require('./StateMachine');require('./TestingStateMachine');testSateMachine();"
 *******************************************************************************/
testSateMachine = function() {
    s = new YaStateMachineJS({debug: false});
    var stateInit = s.newState({
        do: function() {
            console.log("state action : do in the SM (state initial).");
        },
        outing: function() {
            console.log("state action : outing in the SM (state initial).");
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
            console.log("state action : I'm \"state1\" and I do(). ");
        },
        outing: function() {
            console.log("state action : I'm \"state1\" and I outing().");
        }
    });
    stateInit.newTransition(state1, function() {
        return true;
    });
    s.start();
    s.do();
    s.transition();
    s.do();
    s.do();//second times
    s.stop();
}

