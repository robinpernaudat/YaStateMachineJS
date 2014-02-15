


/**
 * This is "yet another state machine" implementation.
 * @author "Robin PERNAUDAT" <robin@pernaudat.com>
 * @version 0.1
 * @returns a state machine
 */
YaStateMachineJS = function(opt) {
    this.myType = 'statemachine';
    this.m_listState = [];
    this.currentState = null;
    this.initialState = null;



     /**
      * Object State.
      * @param {State} _sm
      * @param {Object} o
      * @returns {undefined}
      */
    var State = function(_sm, o) {
        this.sm = _sm;
        this.f_entering = null;
        this.f_do = null;
        this.f_ending = null;
        this.data = null;
        this.myType = 'state';
        this.transitions = [];

        /**
         * Set data stored in the state.
         * @param {Object} d
         */
        this.setData = function(d) {
            if (d && typeof d === 'object') {
                this.data = d;
            } else {
                this.data = null;
                console.log('ERROR : the data of a state must be an object !');
            }
        };

        /**
         * Set entering function. This function is called when the token coming into this state.
         * @param {function} f
         */
        this.setEntering = function(f) {
            if (f && typeof f === 'function') {
                this.f_entering = f;
            } else {
                this.f_entering = null;
                console.log('ERROR : the entering() of a state must be a function !');
            }
        };

        /**
         * Set the do function. This function is StateMachine.do() when the token is on this state.
         * @param {function} f
         */
        this.setDo = function(f) {
            if (f && typeof f === 'function') {
                this.f_do = f;
            } else {
                this.f_do = null;
                console.log('ERROR : the do() of a state must be a function !');
            }
        };

        /**
         * Set outing function. This function is called when the token leaving this state
         * @param {function} f
         */
        this.setEnding = function(f) {
            if (f && typeof f === 'function') {
                this.f_ending = f;
            } else {
                this.f_ending = null;
                console.log('ERROR : the outing() of a state must be a function !');
            }
        };

        if (o.entering) {
            this.setEntering(o.entering);
        }
        if (o.do) {
            this.setDo(o.do);
        }
        if (o.outing) {
            this.setEnding(o.outing);
        }
        if (o.data) {
            this.setData(o.data);
        }

        /**
         * 
         * @param {State} d : destination State (if condition is true).
         * @param {function} c : condition of transition.
         */
        this.newTransition = function(d, c) {
            new Transition(this, d, c);
        };

        this.entering = function() {
            if (this.f_entering)
                this.f_entering();
        };
        this.outing = function() {
            if (this.f_ending)
                this.f_ending();
        };
        this.do = function() {
            if (this.f_do)
                this.f_do();
        };
    };

    /**
     * Object Transition
     * @param {State} src : the source Sate
     * @param {State} _dest : the destination State
     * @param {function} _cond : the condition
     */
    var Transition = function(src, _dest, _cond) {
        this.myType = 'transition';
        this.dest = null;
        this.cond = null;
        if (opt.debug)
            console.log('TEST : new Transition');
        if (src && src.myType && src.myType === 'state') {
        } else {
            console.log("ERROR : \"Transition\" have a \"src\".");
            return null;
        }
        if (_dest && _dest.myType && _dest.myType === 'state') {
            this.dest = _dest;
        } else {
            console.log("ERROR : \"Transition\" have a \"dest\".");
            return null;
        }
        if (_cond && typeof _cond === 'function') {
            this.cond = _cond;
        } else {
            console.log("ERROR : \"Transition\" have a \"cond()\" (function returning a boolean).");
            return null;
        }
        src.transitions.push(this);
    };



    /**
     * Create the new state with functions and data.
     * structure for object o : { f_entering:function(){...}, f_do:function(){...}, f_ending:function(){...}, data:{...} }
     * @param {Object} o defining all functions and data.
     * @returns {State} s : the pointer of the state.
     */
    this.newState = function(o) {
        var s = new State(this, o);
        this.m_listState.push(s);
        return s;
    };

    /**
     * Set the initial state. The state must be already in the state machine.
     * @param State initial state
     */
    this.setInitSate = function(s) {
        if (opt.debug)
            console.log('TEST : call setInitSate');
        //check if it's in state list
        for (i in this.m_listState) {
            if (s === this.m_listState[i]) {
                if (opt.debug)
                    console.log('TEST : initial state in the list');
                this.initialState = s;
            }
        }
    };

    /**
     * This method starts the state machine. An initial state must be defined.
     */
    this.start = function() {
        if (this.initialState !== null) {
            this.currentState = this.initialState;
            this.currentState.entering();
        } else {
            console.log("ERROR : You can't start a state machine without initial state.");
        }
    }

    /**
     * This function stop the machine. 
     * It can be used when there is an error...
     * No message, no ending action...
     */
    this.reset = function() {
        this.currentState = null;
    }

    /**
     * This function stop the machine. The ending function is called if it exists.
     */
    this.stop = function() {
        this.currentState.outing();
        this.reset();
    }

    /**
     * Try to do a transition
     */
    this.transition = function() {
        var destCount = 0;
        var d = null;

        for (i in this.currentState.transitions) {
            var t = this.currentState.transitions[i];
            if (t.cond()) {
                destCount++;
                d = t.dest;
                if (!opt.debug)break;
            }
        }

        if (opt.debug && destCount > 1) {
            console.log("ERROR : More than one destination is possible.");
        } else if (opt.debug && d) {
            this.currentState.outing();
            this.currentState = d;
            this.currentState.entering();
        }
    }

    /**
     * Do the action of the current state.
     */
    this.do = function() {
        if (this.currentState && this.currentState.myType === 'state' && this.currentState.do) {
            this.currentState.do();
        }
    }

}


