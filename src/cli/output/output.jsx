import { useState, useEffect, useRef } from 'react'
import { render, Box, Static, Text, Newline, Spacer } from 'ink'
import BigText from 'ink-big-text'
import Divider from 'ink-divider'
import Spinner from 'ink-spinner'
import Markdown from 'ink-markdown'
import callsites from 'callsites'
import chalk from 'chalk'

const RunesmithHeader = () => (
  <Box flexGrow={1} flexDirection="column" alignItems="center" marginY={3}>
    <BigText text=" Runesmith" font="tiny" colors={['gray']} space={false} />
    <Divider width={40} dividerColor="gray" />
    <Text color="gray" dimColor>
      Roll20 character sheet compiler
    </Text>
  </Box>
)

const RunesmithApp = ({ input }) => {
  const [outputs, setOutputs] = useState([])

  useEffect(() => {
    try {
      input.run(message => {
        setOutputs(previousOutputs => [
          ...previousOutputs,
          {
            id: previousOutputs.length,
            message: message,
          },
        ])
      })
    } catch (err) {
      let call = callsites()[0]
      setOutputs(previousOutputs => [
        ...previousOutputs,
        {
          id: previousOutputs.length,
          error: err.name,
          message: err.message,
          meta: `${call.getFileName()}:${call.getLineNumber()}`,
        },
      ])
    }
    // if (mode === 'production') {
    //   try {
    //     input.run()
    //     // input.run((err, stats) => {
    //     //   setOutputs(previousOutputs => [
    //     //     ...previousOutputs,
    //     //     {
    //     //       id: previousOutputs.length,
    //     //       message: `Build finished in ${chalk.blue('build/directory/')}.`,
    //     //     },
    //     //   ])
    //     // })
    //   } catch (err) {
    //     let call = callsites()[0]
    //     setOutputs(previousOutputs => [
    //       ...previousOutputs,
    //       {
    //         id: previousOutputs.length,
    //         error: err.name,
    //         message: err.message,
    //         meta: `${call.getFileName()}:${call.getLineNumber()}`,
    //       },
    //     ])
    //   }
    // } else if (mode === 'development') {
    //   try {
    //     // input.run((err, stats) => {
    //     //   setOutputs(previousOutputs => [
    //     //     ...previousOutputs,
    //     //     {
    //     //       id: previousOutputs.length,
    //     //       message: `Build finished in ${chalk.blue(String(__dirname))}.`,
    //     //     },
    //     //   ])
    //     // })
    //   } catch (err) {
    //     let call = callsites()[0]
    //     setOutputs(previousOutputs => [
    //       ...previousOutputs,
    //       {
    //         id: previousOutputs.length,
    //         error: err.name,
    //         message: err.message,
    //         meta: `${call.getFileName()}:${call.getLineNumber()}`,
    //       },
    //     ])
    //   }
    // }
  }, [])

  return (
    <>
      <RunesmithHeader />

      {outputs.map(({ id, message, error = null, meta = null }) => (
        <RunesmithOutput key={id} error={error} output={message} meta={meta} />
      ))}

      <Newline />
    </>
  )
}

const RunesmithOutput = ({ output, error = false, meta = false }) => {
  return (
    <Box flexDirection="row" alignItems="flex-start">
      <Box marginRight={1}>
        <Text bold color="gray">
          ᚱ:
        </Text>
      </Box>
      <Box flexGrow={1}>
        {error && (
          <>
            <Text color="red">Error: {error}</Text>
            <Text> - </Text>
          </>
        )}
        <Text>{output}</Text>
        <Spacer />
        <Box width={25} paddingLeft={2} justifyContent="flex-end">
          {meta && (
            <>
              <Text color="gray" dimColor>
                (
              </Text>

              <Box>
                <Text color="gray" wrap="truncate-start">
                  {meta}
                </Text>
              </Box>

              <Text color="gray" dimColor>
                )
              </Text>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default (mode, input) => render(<RunesmithApp input={input} />)
