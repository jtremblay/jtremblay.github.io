library(data.table)

file = "~/Projects/D3/taxonomy_charts/otu_table_final_normalized_L6.txt"
mapping_file = "~/Projects/D3/taxonomy_charts/mapping_file.tsv"

mapping = data.frame(fread(mapping_file, sep="\t"), check.names=FALSE)
mapping$Date = ""
mapping[mapping$TimePoint == "Fresh",]$Date = "2015-10-02"
mapping[mapping$TimePoint == "Day.1",]$Date = "2015-10-03"
mapping[mapping$TimePoint == "Day.2",]$Date = "2015-10-04"
mapping[mapping$TimePoint == "Day.4",]$Date = "2015-10-06"
mapping[mapping$TimePoint == "Day.8",]$Date = "2015-10-10"
mapping[mapping$TimePoint == "Day.16",]$Date = "2015-10-18"
mapping[mapping$TimePoint == "Day.32",]$Date = "2015-11-03"
mapping[mapping$TimePoint == "Day.64",]$Date = "2015-12-05"

   
#Fresh = 2015-10-02
#Day1 = 2015-10-03
#Day2 = 2015-10-04
#Day4 = 2015-10-06
#Day8 = 2015-10-10
#Day16 = 2015-10-18
#Day32 = 2015-11-03
#Day64 = 2015-12-05

write.table(mapping, "~/Projects/D3/taxonomy_charts/mapping_file2.tsv", sep="\t", row.names=FALSE, quote=FALSE)



### From mapping 2, generate abundante table.
