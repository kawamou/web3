// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("we have been constructed!");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    // publicで公開されたAPIエンドポイントになるイメージ
    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "wait 15m"
        );

        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("random # generated: %s", seed);

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmout = 0.0001 ether;
            require(
                prizeAmout <= address(this).balance,
                "trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmout}("");
            require(success, "failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("we have %d total waves!", totalWaves);
        return totalWaves;
    }
}
