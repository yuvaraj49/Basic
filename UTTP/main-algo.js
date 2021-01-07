		var mapper={};												// subject -> facultynames
		var subnames=[]; 											// subnames
		var timeslots={};											// timeperiod -> subject
		var hrsperday;
		var eachsubcount;

		function canAllot(ind,con) 									// Controlling occurance of randomly generated subject.
		{
			var cursub=subnames[ind];
			var freqcursub=0;
			for(var all in timeslots)
			{
				if(timeslots[all]==cursub)
				{
					freqcursub++;
				}
			}
			return (freqcursub<con) ?  true : false; 
		}
		function main(total,hlen) {

			mapper={};										// empty the arrays if main() is called twice..
			timeslots={};
			subnames=[];

			var i=0;			
			for(i=0;i<total;i++)
			{
				subnames[i]=$("#sub"+i+"").val();
			}
			
			for(i=0;i<total;i++)
			{
				mapper[subnames[i]]=$("#fac"+i+"").val();
			}

			hrsperday=Math.floor(6*(60/hlen))-1;						// no of divisions 6 hrs can be made as per hlen [-1 for lunch]
			
			eachsubcount=Math.ceil(hrsperday/subnames.length);						// max no of times a subject can occur in one day.

			var d=new Date("Nov 12,2020 09:00");
			var midbreak=0;
			while(d.getHours()<15)														// Running loop from 9.00 to 3.00
			{
				var pstart=""+d.getHours().toString().padStart(2,'0')+":"+d.getMinutes().toString().padEnd(2,'0');
				d.setTime(d.getTime()+(hlen*60*1000));
				if(d.getHours()>14 && d.getMinutes()>0)
				{
					break;
				}
				var pend=""+d.getHours().toString().padStart(2,'0')+":"+d.getMinutes().toString().padEnd(2,'0');	
																					// pstart and pend are begin and end of each hour

				if(d.getHours()>12 && midbreak==0)
				{
					midbreak=1;
					timeslots[pstart+" to "+pend]="Lunch break";
					continue;
				}

				while(true) 													  // check if a subject occured more than eachsubcount
				{
					var subtoallot=Math.floor((Math.random()*10))%subnames.length;
					if(canAllot(subtoallot,eachsubcount))
					{
						timeslots[pstart+" to "+pend]=subnames[subtoallot];
						break;
					}
				}
			}
		//	console.log(timeslots);
		}