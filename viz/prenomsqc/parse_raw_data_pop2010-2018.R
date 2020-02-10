options(stringsAsFactors = FALSE)
library(data.table)
library(reshape2)

###########################
# GARS ####################
###########################
table_male = data.frame(fread("~/Projects/D3/prenoms_quebec/gars1980-2018.csv", sep=",", header=TRUE), check.names=FALSE)
colnames(table_male)[1] = "Prenom"

table_male2 = cbind(table_male, (rowSums(table_male[2:(ncol(table_male))]))/1 )
table_male2 = table_male2[order(-table_male2[, ncol(table_male2)]),,drop=FALSE]
table_male2[,ncol(table_male2)] = NULL
table_male3 = table_male2[1:100,] #Keep the 100 most abundant first names

table_male3 = rbind(table_male3, table_male2[table_male2$Prenom == "HENRI",])
table_male3 = rbind(table_male3, table_male2[table_male2$Prenom == "EDGAR",])
table_male3 = table_male3[complete.cases(table_male3),]

df = reshape2::melt(table_male3)
df$sex = "M"
colnames(df) = c("name", "year", "n", "sex")
df = df[,c("year", "sex", "name", "n")]

# Then compute proportion of name per year
# Reload table just to be sure...
table_male = data.frame(fread("~/Projects/D3/prenoms_quebec/gars1980-2018.csv", sep=",", header=TRUE), check.names=FALSE)
colnames(table_male)[1] = "Prenom"
table_male2 = cbind(table_male, (rowSums(table_male[2:(ncol(table_male))]))/1 )
table_male2 = table_male2[order(-table_male2[, ncol(table_male2)]),,drop=FALSE]
table_male2[,ncol(table_male2)] = NULL
table_male3 = table_male2[1:100,]

table_male3 = rbind(table_male3, table_male2[table_male2$Prenom == "HENRI",])
table_male3 = rbind(table_male3, table_male2[table_male2$Prenom == "EDGAR",])
table_male3 = table_male3[complete.cases(table_male3),]

# Convert
table_male2Perc = prop.table(data.matrix(table_male3[,2:ncol(table_male3)]), margin=2)*100
table_male2Perc = data.frame(Prenom=table_male3$Prenom, table_male2Perc, check.names=FALSE)
tmp = round(table_male2Perc[,2:ncol(table_male2Perc)], digits=2)
tmp2 = cbind(table_male2Perc$Prenom, tmp)
colnames(tmp2)[1] = "Prenom"
df_perc = melt(tmp2)
colnames(df_perc) = c("name", "year", "prop")

df$variable = paste0(df$name, "-", df$year)
df_perc$variable = paste0(df_perc$name, "-", df_perc$year)

df2 = merge(df, df_perc[,c("variable", "prop")], by="variable")
df2$variable = NULL
write.table(df2, "~/Projects/D3/prenoms_quebec/gars1980-2018_parsed.csv", sep=",", quote=FALSE, row.names=FALSE)

#########################
## FILLES ###############
#########################
table_female = data.frame(fread("~/Projects/D3/prenoms_quebec/filles1980-2018.csv", sep=",", header=TRUE), check.names=FALSE)
colnames(table_female)[1] = "Prenom"

table_female2 = cbind(table_female, (rowSums(table_female[2:(ncol(table_female))]))/1 )
table_female2 = table_female2[order(-table_female2[, ncol(table_female2)]),,drop=FALSE]
table_female2[,ncol(table_female2)] = NULL
table_female3 = table_female2[1:100,] #Keep the 100 most abundant first names

table_female3 = rbind(table_female3, table_female2[table_female2$Prenom == "ADELE",])
table_female3 = table_female3[complete.cases(table_female3),]
#table_female3 = rbind(table_female3, table_female2[table_female2$Prenom == "EDGAR",])

df = melt(table_female3)
df$sex = "F"
colnames(df) = c("name", "year", "n", "sex")
df = df[,c("year", "sex", "name", "n")]

# Then compute proportion of name per year
# Reload table just to be sure...
table_female = data.frame(fread("~/Projects/D3/prenoms_quebec/filles1980-2018.csv", sep=",", header=TRUE), check.names=FALSE)
colnames(table_female)[1] = "Prenom"
table_female2 = cbind(table_female, (rowSums(table_female[2:(ncol(table_female))]))/1 )
table_female2 = table_female2[order(-table_female2[, ncol(table_female2)]),,drop=FALSE]
table_female2[,ncol(table_female2)] = NULL
table_female3 = table_female2[1:100,]

table_female3 = rbind(table_female3, table_female2[table_female2$Prenom == "ADELE",])
table_female3 = table_female3[complete.cases(table_female3),]
# Convert
table_female2Perc = prop.table(data.matrix(table_female3[,2:ncol(table_female3)]), margin=2)*100
table_female2Perc = data.frame(Prenom=table_female3$Prenom, table_female2Perc, check.names=FALSE)
tmp = round(table_female2Perc[,2:ncol(table_female2Perc)], digits=2)
tmp2 = cbind(table_female2Perc$Prenom, tmp)
colnames(tmp2)[1] = "Prenom"
df_perc = melt(tmp2)
colnames(df_perc) = c("name", "year", "prop")

df$variable = paste0(df$name, "-", df$year)
df_perc$variable = paste0(df_perc$name, "-", df_perc$year)

df2 = merge(df, df_perc[,c("variable", "prop")], by="variable")
df2$variable = NULL
write.table(df2, "~/Projects/D3/prenoms_quebec/filles1980-2018_parsed.csv", sep=",", quote=FALSE, row.names=FALSE)
