// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Script} from "forge-std/Script.sol";
// import {HelperConfig} from "./HelperConfig.s.sol";
import {Hodor} from "../src/Hodor.sol";

contract DeployFundMe is Script {
    function run() external returns (Hodor) {
        // HelperConfig helperConfig = new HelperConfig(); // This comes with our mocks!
        // address priceFeed = helperConfig.activeNetworkConfig();

        vm.startBroadcast();
        Hodor hodor = new Hodor();
        vm.stopBroadcast();
        return (hodor);
    }
}