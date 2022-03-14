import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import { useInput } from "@/hooks/useInput";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { truncateAddress } from "@/utils";
import { cBallot } from "../../hardhat/types/cBallot";

export function CBallotContract({ contractData }) {
    const { kit, address, network, performActions } = useContractKit();
    const [chairpersonValue, setChairpersonValue] = useState<string>("");
   
    const [newVoterAddressInput, setNewVoterAddressInput] = useInput({ type: "string" });

    const [userWeight, setUserWeight] = useState<number>(0);
    const [voted, setVoted] = useState<boolean>(false);
    const [delegateAddressValue, setDelegateAddressValue] = useState<string | null>(null);
    const [proposalVote, setProposalVote] = useState<number | null>(null);
    const [proposalVoteName, setProposalVoteName] = useState<string | null>(null);

    const [newDelegateAddressInput, setNewDelegateAddressInput] = useInput({ type: "string" });

    const [proposal1NameValue, setProposal1NameValue] = useState<string>("");
    const [proposal1VotesCount, setProposal1VotesCount] = useState<number>(0);
    const [proposal2NameValue, setProposal2NameValue] = useState<string>("");
    const [proposal2VotesCount, setProposal2VotesCount] = useState<number>(0);

    const [idProposalToVoteInput, setIdProposalToVoteInput] = useInput({ type: "number" });

    const [winnerNameValue, setWinnerNameValue] = useState<string>("");
    const [idWinner, setIdWinner] = useState<number>(0);

    const [contractLink, setContractLink] = useState<string>("");
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const contract = contractData
        ? (new kit.web3.eth.Contract(
            contractData.abi,
            contractData.address
        ) as any as Ballot)
        : null;

    useEffect(() => {
        if (contractData) {
            setContractLink(`${network.explorer}/address/${contractData.address}`);
        }
    }, [network, contractData]);

    const giveRightToVote = async () => {
        try {
            await performActions( async (kit) => {
                const gasLimit = await contract.methods
                    .giveRightToVote(newVoterAddressInput)
                    .estimateGas();
                const result = await contract.methods
                    .giveRightToVote(newVoterAddressInput)
                    .send({from: address, gasLimit});

                console.log(result);

                const variant = result.status == true ? "success" : "error";
                const url = `${network.explorer}/tx/${result.transactionHash}`;

                const action = (key) => {
                    <>
                        <Link href={url} target="_blank">
                            View on Explorer
                        </Link>
                        <Button onClick={() => {
                            closeSnackbar(key);
                        }}
                        >
                            X
                        </Button>
                    </>
                };
                enqueueSnackbar("New Voter added", {
                    variant, action
                });
            });
        } catch(e) {
            console.error(e);
        }
    };

    const delegateVote = async () => {
        try {
            await performActions(async (kit) => {
                const gasLimit = await contract.methods
                    .delegate(newDelegateAddressInput)
                    .estimateGas();
                const result = await contract.methods
                    .delegate(newDelegateAddressInput)
                    .send({from: address, gasLimit});

                console.log(result);

                const variant = result.status == true ? "succes" : "error";
                const url = `${network.explorer}/tx/${result.transactionHash}`;

                const action = (key) => {
                    <>
                        <Link href={url} target="_blank">
                            View on Explorer
                        </Link>
                        <Button onClick={(key) => {
                            closeSnackbar(key);
                        }}>
                            X
                        </Button>
                    </>
                };
                enqueueSnackbar("Delegate Vote success", {
                    variant,
                    action
                });
            });
        } catch (e) {
            console.error(e);
        }
    };

    const voteProposal = async () => {
        try {
            await performActions( async (kit) => {
                const gasLimit = await contract.methods
                    .vote(idProposalToVoteInput)
                    .estimateGas();
                const result = await contract.methods
                    .vote(idProposalToVoteInput)
                    .send({ from: address, gasLimit});
                const variant = result.status == true ? "success" : "error";
                const url = `${network.explorer}/tx/${result.transactionHash}`;

                const action = (key) => {
                    <>
                        <Link href={url} target="_blank">
                            View on Explorer
                        </Link>
                        <Button onClick={ () => {
                            closeSnackbar(key);
                        }}>
                            X
                        </Button>
                    </>
                };
                enqueueSnackbar("Vote sent succesfully", {
                    variant,
                    action
                });
            });
        } catch (e) {
            console.error(e);
        }
    };

    const loadContract = async () => {
        try {
            await performActions( async (kit) => {
                const resultChairPerson = await contract.methods
                    .chairperson()
                    .call();
                const resultProposal1 = await contract.methods
                    .proposals(0)
                    .call();
                const resultProposal2 = await contract.methods
                    .proposals(1)
                    .call();
                const resultVoter = await contract.methods
                    .voters(address)
                    .call();
                const resultWinner = await contract.methods
                    .winningProposal()
                    .call();
                const resultWinnerName = await contract.methods
                    .winnerName()
                    .call();
                console.log(resultChairPerson);
                console.log(resultChairPerson == address);
                setChairpersonValue(resultChairPerson);
                setProposal1NameValue(resultProposal1[0]);
                setProposal1VotesCount(resultProposal1[1]);
                setProposal2NameValue(resultProposal2[0]);
                setProposal2VotesCount(resultProposal2[1]);
                setUserWeight(resultVoter[0]);
                setVoted(resultVoter[1]);
                if (resultVoter[2] !== "0x0000000000000000000000000000000000000000") {
                    setDelegateAddressValue(resultVoter[2]);
                }
                if (voted && delegateAddressValue !== null) {
                    setProposalVote(resultVoter[3]);
                    const resultProposalVoteName = await contract.methods.proposals(resultVoter[3]).call();
                    setProposalVoteName(resultProposalVoteName[0]);
                }
                setIdWinner(resultWinner[0]);
                setWinnerNameValue(resultWinnerName[0]);
            });
        } catch(e) {
            console.error(e);
        }
    };


    return (
        <Grid sx={{ m: 1 }} container justifyContent="center">
            <Grid item xs={6} sx={{ m: 2 }}>
                <Typography variant="h5">Ballot Contract:</Typography>
                {contractData ? (
                    <Link href={contractLink} target="_blank">
                        {truncateAddress(contractData?.address)}
                    </Link>
                ) : (
                    <Typography>No contract detected for {network.name}</Typography>
                )}

                <Divider sx={{ m: 1 }} />
                <Typography variant="h6">Ballot Contract </Typography>

                <Divider sx={{ m: 1}} />
                <Button sx={{ m: 1, marginLeft: 0}} variant="contained" onClick={loadContract}>
                    Load Contract data
                </Button>

                <Divider sx={{ m:1 }} />
                <Typography variant="h6"> Chair Person Address </Typography>
                <Typography sx={{ m: 1, marginLeft: 0 }}>
                    {chairpersonValue}
                </Typography>

                <Divider sx={{ m:1 }} />
                <Typography variant="h5"> Voter Status </Typography>
                <Typography sx={{ m:1 }}> User weight: {userWeight} </Typography>
                {!voted  ? (
                    <div id="voteBlock">
                        <Typography sx={{ m:1 }}> Set Proposal Vote {proposalVoteName} </Typography>
                        <Box sx={{ m:1 }}>{setIdProposalToVoteInput}</Box>
                        <Button sx={{ m:1 }} variant="contained" onClick={voteProposal}>
                            Vote Proposal
                        </Button>
                        <Divider sx={{ m:1 }} />
                        <Typography sx={{ m:1 }} variant="h6">
                            Delegate Vote
                        </Typography>
                        <Box sx={{ m:1 }}>{setNewDelegateAddressInput}</Box>
                        <Button sx={{ m:1 }} variant="contained" onClick={delegateVote}>
                            Delegate Vote
                        </Button>
                    </div>
                ):(
                    <Typography sx={{ m:1 }} variant="h6"> Voted for {proposalVoteName} </Typography>
                )}

                <Divider sx={{ m:1 }} />
                <Typography variant="h5"> Proposals </Typography>
                <Typography sx={{ m:1 }}>
                    {proposal1NameValue} : {proposal1VotesCount} votes
                </Typography>
                <Typography sx={{ m:1 }}>
                    {proposal2NameValue} : {proposal2VotesCount} votes
                </Typography>
                <Divider sx={{ m:1 }} />
                {chairpersonValue == address ? (
                    <div id="addVoter">
                        <Typography sx={{ m:1 }} variant="h6">
                            Give Right to vote
                        </Typography>
                        <Box sx={{ m:1 }}>{setNewVoterAddressInput}</Box>
                        <Button sx={{ m:1}} variant="contained" onClick={giveRightToVote}>
                            Add Voter Address
                        </Button>
                    </div>
                ) : (
                    <Divider sx={{ m:1 }} />
                ) }
            </Grid>
        </Grid>
                );
}