namespace WS.Infraestructure.Connection
{
#if NET8_0_OR_GREATER
    using Microsoft.Data.SqlClient;
    using Microsoft.EntityFrameworkCore;
    using System.Data;
    using System.Data.Common;

    public class AppDbContext : DbContext
    {
        public AppDbContext() { }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }


        public virtual async Task<DataTableCollection> ExecuteStoreProcedureAsync(string spName, params SqlParameter[] parameters)
        {
            return await this.ExecuteStoreProcedureAsync(spName, null, parameters);
        }

        public virtual async Task<DataTableCollection> ExecuteStoreProcedureAsync(string spName, DbTransaction transaction, params SqlParameter[] parameters)
        {
            DataSet dataSet = new DataSet();

            using (DbCommand command = this.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = spName;
                command.CommandType = CommandType.StoredProcedure;

                if (transaction != null)
                {
                    command.Transaction = transaction;
                }

                parameters?.ToList().ForEach(x =>
                {
                    DbParameter dbParam = command.CreateParameter();
                    dbParam.ParameterName = x.ParameterName;
                    dbParam.Value = x.Value;
                    dbParam.Direction = x.Direction;
                    dbParam.DbType = x.DbType;
                    dbParam.Size = x.Size;
                    command.Parameters.Add(dbParam);
                });

                this.Database.OpenConnection();

                DbDataAdapter adapter = DbProviderFactories.GetFactory(this.Database.GetDbConnection()).CreateDataAdapter();
                adapter.SelectCommand = command;
                adapter.Fill(dataSet);

                return await Task.FromResult(dataSet.Tables);
            }
        }

        public async Task<DataTableCollection> ExecuteQueryAsync(string queryStatement)
        {
            DataSet dataSet = new DataSet();

            using (DbCommand command = this.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = queryStatement;
                command.CommandType = CommandType.Text;

                this.Database.OpenConnection();

                DbDataAdapter adapter = DbProviderFactories.GetFactory(this.Database.GetDbConnection()).CreateDataAdapter();
                adapter.SelectCommand = command;
                adapter.Fill(dataSet);

                return await Task.FromResult(dataSet.Tables);
            }
        }
    }
#endif
}
