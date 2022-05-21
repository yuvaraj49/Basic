function computeTSP(srcindex,adj,n)
{

    var final_path=new Array(n+1);
    var visited=new Array(n)

    var final_res=Number.MAX_VALUE;

    function copyToFinal(curr_path)
	{
		for (var i = 0; i < n; i++)
			final_path[i] = curr_path[i];
		final_path[n] = curr_path[0];
	}

    function firstMin(adj,i)
	{
		var min = Number.MAX_VALUE;
		for (var k = 0; k < n; k++)
			if (adj[i][k] < min && i != k)
				min = adj[i][k];
		return min;
	}

    function secondMin(adj,i)
	{
		var first = Number.MAX_VALUE, second = Number.MAX_VALUE;
		for (var j=0; j<n; j++)
		{
			if (i == j)
				continue;

			if (adj[i][j] <= first)
			{
				second = first;
				first = adj[i][j];
			}
			else if (adj[i][j] <= second && adj[i][j] != first)
				second = adj[i][j];
		}
		return second;
	}

    function TSPRec(adj,curr_bound,curr_weight,level, curr_path)
    {
        if (level == n)
        {
            if (adj[curr_path[level - 1]][curr_path[0]] != 0)
            {
                var curr_res = curr_weight + adj[curr_path[level-1]][curr_path[0]];
                if (curr_res < final_res)
                {
                    copyToFinal(curr_path);
                    final_res = curr_res;
                }
            }
            return;
        }
        for (var i = 0; i < n; i++)
		{
			if (adj[curr_path[level-1]][i] != 0 && visited[i] == false)
			{
				var temp = curr_bound;
				curr_weight += adj[curr_path[level - 1]][i];

				if (level==1)
				    curr_bound -= ((firstMin(adj, curr_path[level - 1]) + Number.parseInt(firstMin(adj, i))/2));
				else
				    curr_bound -= ((secondMin(adj, curr_path[level - 1]) + Number.parseInt(firstMin(adj, i))/2));

				if (curr_bound + curr_weight < final_res)
				{
					curr_path[level] = i;
					visited[i] = true;

					TSPRec(adj, curr_bound, curr_weight, level + 1,
						curr_path);
				}

				curr_weight -= adj[curr_path[level-1]][i];
				curr_bound = temp;

				visited.fill(false);
				for (var j = 0; j <= level - 1; j++)
					visited[curr_path[j]] = true;
			}
		}
    }
    function TSP(adj)
	{
		var curr_path = new Array(n + 1);

		var curr_bound = 0;
		curr_path.fill(-1)
        visited.fill(false)
 
		for (var i = 0; i < n; i++)
			curr_bound += (firstMin(adj, i) + secondMin(adj, i));

		curr_bound = (curr_bound==1)? Number.parseInt(curr_bound/2) + 1 : Number.parseInt(curr_bound/2);

		visited[srcindex] = true;
		curr_path[0] = srcindex;

		TSPRec(adj, curr_bound, 0, 1, curr_path);
	}
    
    
    TSP(adj);
    
    console.log("Cost : "+final_res)
    console.log("Path taken : ")
    
    for (var i = 0; i <= n; i++)
    {
        console.log(final_path[i]);
    }
    
    return [final_path,final_res];
}