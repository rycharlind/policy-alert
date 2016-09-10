contract Policy { 
    
    string public policyNumber;
    uint[] public keys;

    event Alert(string policyNumber);

    function Policy(
        uint[] _keys,
        string _policyNumber
        ) {
        keys = _keys;
        policyNumber = _policyNumber;    
    }
    
    function infoWasUpdated(key) returns(bool sufficient) {
        for (uint x = 0; x < keys.length; i++) {
            if (keys[x] == key) {
                Alert(policyNumber);
                return true;
            }
        }
        return false;
    }

    function () {
        throw; 
    }        
}     