contract Policy { 
    
    string public policyNumber;
    uint[] public keys;
    string public test;

    event Alert(string policyNumber);

    function Policy(
        uint[] _keys,
        string _policyNumber
        ) {
        keys = _keys;
        policyNumber = _policyNumber;    
    }
    
    function infoWasUpdated() returns(bool sufficient) {
        test = "ryan";
        Alert(policyNumber);
        return true;
    }

    function () {
        throw; 
    }        
}     