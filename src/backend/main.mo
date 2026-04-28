import ProtocolLib "lib/protocol";
import ProtocolApi "mixins/protocol-api";

actor {
  let state : ProtocolLib.State = ProtocolLib.newState();

  include ProtocolApi(state);
};
