// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Context.sol";
import "./IERC20.sol";
import "./IERC20Metadata.sol";

contract NoahToken is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;

    function totalSupply() external view override returns (uint256) {}

    function balanceOf(
        address account
    ) external view override returns (uint256) {}

    function transfer(
        address to,
        uint256 amount
    ) external override returns (bool) {}

    function allowance(
        address owner,
        address spender
    ) external view override returns (uint256) {}

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {}

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external override returns (bool) {}

    function name() external view override returns (string memory) {}

    function symbol() external view override returns (string memory) {}

    function decimals() external view override returns (uint8) {}
}
