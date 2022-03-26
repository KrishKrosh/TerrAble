# #!/bin/bash
# while
# do
#     if ([$? -eq 1] || [$? -eq 1] )
#     then 
#         terrain deploy counter --signer bombay --network testnet 
#     fi
#     echo "Deploying counter contract"
# done

A=0
while :
do
	if [ $? -eq 1 ] && [$A==1]
	then
        terrain deploy counter --signer bombay --network testnet 
    else
        
        A=1
	fi
done